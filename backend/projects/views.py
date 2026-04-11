from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from .models import Project
from .serializers import (
    ProjectSerializer,
    ProjectCreateSerializer
)


# =========================
# Project
# =========================

class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return ProjectCreateSerializer
        return ProjectSerializer


