# serializers.py
from rest_framework import serializers
from .models import User

# ユーザー取得用
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "role", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "role", "is_active", "created_at", "updated_at"]  # role, is_active は一般ユーザーから変更不可

# 登録用
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("パスワードは必須です")
        if len(value) < 3:
            raise serializers.ValidationError("パスワードは最低3文字必要です")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        # 開発段階は誰でも作れるが、role は強制的に user
        user.role = "user"
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return user