from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):#UserモデルをJSONに変換するだけの機械
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_active", "created_at", "updated_at"]#完全に閲覧専用


class UserCreateSerializer(serializers.ModelSerializer):#ユーザー登録専用
    password = serializers.CharField(write_only=True, min_length=4)#書き込み専用（レスポンスに出ない）

    class Meta:
        model = User
        fields = ["email", "password"]

    def validate_email(self, value):#emailの正規化と重複チェック
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("このメールは既に使用されています")
        return value

    def create(self, validated_data):#実際のユーザー作成
        return User.objects.create_user(#passwordをハッシュ化するため
            email=validated_data["email"],
            password=validated_data["password"],
            name="default",
            department="dev"
        )