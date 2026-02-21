from django.db import models
from django.contrib.auth.models import User

class PROJECT(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("On Hold", "On Hold"),
        ("Completed", "Completed"),
    ]

    title = models.CharField(max_length=255)
    project_code = models.CharField(max_length=10)
    project_description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    start_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)

    project_manager = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,
        null=True,
        related_name="managed_projects"
    )
    
    developers = models.ManyToManyField(
        User, 
        related_name="dev_projects",
        blank=True,
    )
    
    qas = models.ManyToManyField(
        User,
        related_name="qa_projects",
        blank=True,
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title