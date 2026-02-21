from rest_framework import serializers
from django.contrib.auth.models import User
from ...infrastructure.models.tasks import TASK
from projects.infrastructure.models.projects import PROJECT


# -----------------------------
# SIMPLE USER (for list views)
# -----------------------------
class SimpleUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="first_name")

    class Meta:
        model = User
        fields = ["id", "username", "name"]


# -----------------------------
# CREATE TASK (PM)
# -----------------------------
class TaskCreateSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(
        queryset=PROJECT.objects.none()
    )

    assignee = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(
            groups__name__in=["Developer", "QA"]
        ),
        required=False,
        allow_null=True
    )

    class Meta:
        model = TASK
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "project",
            "assignee",
            "due_date",
        ]

    def __init__(self, *args, **kwargs):
        request = kwargs.get("context", {}).get("request")
        super().__init__(*args, **kwargs)

        if request and request.user.is_authenticated:
            # 🔒 PM can only assign tasks in their own projects
            self.fields["project"].queryset = PROJECT.objects.filter(
                project_manager=request.user
            )

    def create(self, validated_data):
        request = self.context["request"]

        task = TASK.objects.create(
            created_by=request.user,
            **validated_data
        )
        return task


# -----------------------------
# LIST TASKS (PM / DEV / QA)
# -----------------------------
class TaskListSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField()
    assignee = SimpleUserSerializer(read_only=True)
    created_by = SimpleUserSerializer(read_only=True)

    class Meta:
        model = TASK
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "project",
            "assignee",
            "created_by",
            "due_date",
            "created_at",
        ]
