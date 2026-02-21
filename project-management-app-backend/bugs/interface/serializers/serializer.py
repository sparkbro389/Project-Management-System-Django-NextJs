from rest_framework import serializers
from django.contrib.auth.models import User
from ...infrastructure.models.bugs import BUG
from projects.infrastructure.models.projects import PROJECT

class SimpleUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="first_name")

    class Meta:
        model = User
        fields = ["id", "username", "name"]

class BugCreateSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(
        queryset=PROJECT.objects.none()
    )

    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="Developer"),
        required=False,
        allow_null=True
    )

    class Meta:
        model = BUG
        fields = [
            "id",
            "title",
            "description",
            "severity",
            "project",
            "assigned_to",
        ]

    def __init__(self, *args, **kwargs):
        request = kwargs.get("context", {}).get("request")
        super().__init__(*args, **kwargs)

        if request and request.user.is_authenticated:
            # QA can report bugs only in projects where QA is assigned
            self.fields["project"].queryset = PROJECT.objects.filter(
                qas=request.user
            )

    def create(self, validated_data):
        request = self.context["request"]

        bug = BUG.objects.create(
            reported_by=request.user,
            **validated_data
        )
        return bug

class BugProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = PROJECT
        fields = ["id", "title"]


class BugListSerializer(serializers.ModelSerializer):
    project = BugProjectSerializer(read_only=True)
    reported_by = SimpleUserSerializer(read_only=True)
    assigned_to = SimpleUserSerializer(read_only=True)

    class Meta:
        model = BUG
        fields = [
            "id",
            "title",
            "description",
            "status",
            "severity",
            "project",
            "reported_by",
            "assigned_to",
            "created_at",
        ]
