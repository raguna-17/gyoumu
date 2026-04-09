# views.py
from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer, UserCreateSerializer

class IsAdminOrSelf(permissions.BasePermission):
    """
    管理者は全操作可能
    一般ユーザーは自分の情報のみ操作可能
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]  # 開発用。切り替え時は IsAdminOrSelf + 認証必須に変更
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminOrSelf()]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        # 一般ユーザーは自分のみ閲覧・取得
        return User.objects.filter(id=user.id)