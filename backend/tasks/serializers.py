from rest_framework import serializers
from django.utils import timezone
from .models import Project, Task
from users.serializers import UserSerializer


# =========================
# Project
# =========================

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)#Projectに紐づくUser情報をネスト表示

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
        read_only_fields = ["id", "owner", "created_at", "updated_at"]#クライアントは変更できない


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["name", "description"]

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("プロジェクト名が短すぎる")
        return value

    def create(self, validated_data):
        user = self.context["request"].user#クライアントにownerを決めさせない
        return Project.objects.create(owner=user, **validated_data)#強制的にログインユーザーのプロジェクトになる


# =========================
# Task
# =========================

class TaskSerializer(serializers.ModelSerializer):
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
        read_only_fields = [
            "id",
            "project",
            "assigned_to",
            "created_by",
            "created_at",
            "updated_at",
        ]


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
        allowed = ["todo", "in_progress", "done"]  # モデルに合わせて調整
        if value not in allowed:
            raise serializers.ValidationError("不正なステータス")
        return value

    def validate(self, attrs):
        # 例：完了なのにprogressが100じゃない問題を防ぐ
        status = attrs.get("status")
        progress = attrs.get("progress")

        if status == "done" and progress != 100:
            raise serializers.ValidationError("完了タスクはprogress=100である必要がある")

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        project = self.context["project"]

        # projectの安全チェック（地味に重要）
        if not isinstance(project, Project):
            raise serializers.ValidationError("projectが不正")

        return Task.objects.create(#クライアントは権限持てない構造
            project=project,
            created_by=request.user,
            **validated_data
        )