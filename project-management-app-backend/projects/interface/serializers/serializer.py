from rest_framework import serializers
from django.contrib.auth.models import User
from ...infrastructure.models.projects import PROJECT


# =====================================================
# USER (READ-ONLY, SAFE)
# =====================================================

class SimpleUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    name = serializers.CharField(source="first_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "name", "role"]

    def get_role(self, obj):
        group = obj.groups.first()
        return group.name if group else None


# =====================================================
# CREATE PROJECT (PM)
# =====================================================

class ProjectCreateSerializer(serializers.ModelSerializer):
    developers = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="Developer"),
        many=True,
        required=False,
        allow_empty=True,
    )
    qas = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="QA"),
        many=True,
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = PROJECT
        fields = [
            "id",
            "title",
            "project_description",
            "due_date",
            "developers",
            "qas",
        ]

    def create(self, validated_data):
        request = self.context.get("request")

        if request is None or not request.user.is_authenticated:
            raise serializers.ValidationError("Authenticated user required.")

        developers = validated_data.pop("developers", [])
        qas = validated_data.pop("qas", [])

        project = PROJECT.objects.create(
            project_manager=request.user,
            **validated_data
        )

        # Assign relations AFTER creation
        if developers:
            project.developers.set(developers)

        if qas:
            project.qas.set(qas)

        return project


# =====================================================
# ASSIGN DEV / QA (Assignments Page)
# =====================================================

class ProjectAssignSerializer(serializers.ModelSerializer):
    developers = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="Developer"),
        many=True,
        required=False,
        allow_empty=True,
    )
    qas = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="QA"),
        many=True,
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = PROJECT
        fields = ["developers", "qas"]

    def update(self, instance, validated_data):
        developers = validated_data.get("developers", None)
        qas = validated_data.get("qas", None)

        # Replace assignments explicitly (matches frontend UI)
        if developers is not None:
            instance.developers.set(developers)

        if qas is not None:
            instance.qas.set(qas)

        instance.save()
        return instance


# =====================================================
# LIST / READ PROJECT (ALL ROLES)
# =====================================================

class ProjectListSerializer(serializers.ModelSerializer):
    project_manager = SimpleUserSerializer(read_only=True)
    developers = SimpleUserSerializer(many=True, read_only=True)
    qas = SimpleUserSerializer(many=True, read_only=True)

    class Meta:
        model = PROJECT
        fields = [
            "id",
            "title",
            "project_description",
            "status",
            "start_date",
            "due_date",
            "project_manager",
            "developers",
            "qas",
        ]
