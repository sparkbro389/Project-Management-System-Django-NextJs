from django.db import models
from django.contrib.auth.models import User
from projects.infrastructure.models.projects import PROJECT


class BUG(models.Model):

    # -----------------------------
    # STATUS & SEVERITY
    # -----------------------------
    class Status(models.TextChoices):
        NEW = "NEW", "New"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        RESOLVED = "RESOLVED", "Resolved"
        CLOSED = "CLOSED", "Closed"

    class Severity(models.TextChoices):
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
        default=Status.NEW,
    )

    severity = models.CharField(
        max_length=10,
        choices=Severity.choices,
        default=Severity.MEDIUM,
    )

    # -----------------------------
    # RELATIONSHIPS
    # -----------------------------
    project = models.ForeignKey(
        PROJECT,
        on_delete=models.CASCADE,
        related_name="bugs",
    )

    reported_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="reported_bugs",
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_bugs",
    )

    # -----------------------------
    # META
    # -----------------------------
    deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["severity"]),
            models.Index(fields=["project"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.status})"
