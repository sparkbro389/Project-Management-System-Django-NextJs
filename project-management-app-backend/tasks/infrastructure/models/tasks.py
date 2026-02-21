from django.db import models
from django.contrib.auth.models import User

from projects.infrastructure.models.projects import PROJECT


class TASK(models.Model):
    # -----------------------------
    # STATUS & PRIORITY CHOICES
    # -----------------------------
    class Status(models.TextChoices):
        BACKLOG = "BACKLOG", "Backlog"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        IN_REVIEW = "IN_REVIEW", "In Review"
        DONE = "DONE", "Done"

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        CRITICAL = "CRITICAL", "Critical"

    # -----------------------------
    # CORE FIELDS
    # -----------------------------
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.BACKLOG,
    )

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    # -----------------------------
    # RELATIONSHIPS
    # -----------------------------
    project = models.ForeignKey(
        PROJECT,
        on_delete=models.CASCADE,
        related_name="tasks",
    )

    assignee = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tasks"
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_tasks",
        help_text="User who created the task (usually PM)",
    )
    is_deleted = models.BooleanField(default=False)
    # -----------------------------
    # DATES
    # -----------------------------
    due_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # -----------------------------
    # META
    # -----------------------------
    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["project"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.status})"
