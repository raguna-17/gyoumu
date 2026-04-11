from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions

from projects.models import Project
from .models import Task
from .serializers import TaskSerializer, TaskCreateSerializer


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_project(self):
        return get_object_or_404(
            Project,
            id=self.kwargs["project_id"],
            owner=self.request.user
        )

    def get_queryset(self):
        project = self.get_project()
        return Task.objects.filter(project=project)

    def get_serializer_class(self):
        return (
            TaskCreateSerializer
            if self.action == "create"
            else TaskSerializer
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["project"] = self.get_project()  # ← これ必須
        return context

    def perform_create(self, serializer):
        serializer.save(
            project=self.get_project(),
            created_by=self.request.user
        )