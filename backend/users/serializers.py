from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_active", "created_at", "updated_at"]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password"]

    def validate_email(self, value):
        value = value.lower().strip()

        if not value:
            raise serializers.ValidationError("メールは必須")

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("このメールは既に使用されています")

        return value

    def validate_password(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("パスワードは4文字以上にしてください")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name="default",
            department="dev"
        )