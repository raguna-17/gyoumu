from rest_framework import serializers
from django.utils import timezone
from .models import Task
from users.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):#実質“完全読み取り専用
    project = serializers.PrimaryKeyRelatedField(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "name",
            "description",
            "assigned_to",
            "created_by",
            "status",
            "progress",
            "due_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "name",
            "description",
            "status",
            "progress",
            "due_date",
        ]

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("タスク名が短すぎる")
        return value

    def validate_progress(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("progressは0〜100である必要がある")
        return value

    def validate_due_date(self, value):
        if value and value < timezone.now().date():
            raise serializers.ValidationError("締切が過去になっている")
        return value

    def validate_status(self, value):
        allowed = ["todo", "in_progress", "done"]
        if value not in allowed:
            raise serializers.ValidationError("不正なステータス")
        return value

    def validate(self, attrs):
        status = attrs.get("status")
        progress = attrs.get("progress")

        if status == "done" and progress != 100:
            raise serializers.ValidationError("完了タスクはprogress=100である必要がある")

        return attrs

    def create(self, validated_data):

        return Task.objects.create(
            **validated_data
        )