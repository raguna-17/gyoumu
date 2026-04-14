from rest_framework import serializers
from django.utils import timezone
from .models import Project
from users.serializers import UserSerializer


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
        read_only_fields = ["id", "owner", "created_at", "updated_at"]#このフィールドはAPI経由で“書き込みできない


class ProjectCreateSerializer(serializers.ModelSerializer):#create = 「どうやってDBに保存するかを上書きする場所」
    class Meta:
        model = Project
        fields = ["name", "description"]

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("プロジェクト名が短すぎる")
        return value

    def create(self, validated_data):#「ownerはクライアントに触らせず、サーバー側で勝手にログインユーザーを入れる」
        request = self.context["request"]#👉 Viewから渡されたrequestを取り出してる
        return Project.objects.create(
            owner=request.user,#ログインユーザーを強制的にownerにする
            **validated_data#{"name": "...", "description": "..."}👉 バリデーション済みの安全データ
        )

