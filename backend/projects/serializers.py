from rest_framework import serializers
from django.utils import timezone
from .models import Project
from users.serializers import UserSerializer


# =========================
# Project
# =========================

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "owner",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["name", "description"]

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("プロジェクト名が短すぎる")
        return value

    def create(self, validated_data):
        request = self.context["request"]
        return Project.objects.create(
            owner=request.user,
            **validated_data
        )

