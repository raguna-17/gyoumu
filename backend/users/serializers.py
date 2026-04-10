from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "role",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password"]

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("このメールは既に使用されています")
        return value

    def create(self, validated_data):
        email = validated_data["email"].lower().strip()
        password = validated_data["password"]

        user = User.objects.create_user(
            email=email,
            password=password,
        )

        user.role = "user"
        user.is_active = True
        user.save()

        return user