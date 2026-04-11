from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User


class Task(models.Model):

    STATUS_CHOICES = [
        ("todo", "未着手"),
        ("in_progress", "進行中"),
        ("done", "完了"),
    ]

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # 誰が担当か
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tasks"
    )

    # 誰が作ったか（重要）
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_tasks"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="todo"
    )

    progress = models.PositiveIntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ]
    )

    due_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.project.name})"

    class Meta:
        indexes = [
            models.Index(fields=["project"]),
            models.Index(fields=["status"]),
            models.Index(fields=["assigned_to"]),
        ]