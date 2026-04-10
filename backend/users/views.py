from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class IsAdminOrSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.id == request.user.id


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]

        if self.action in ["list"]:
            return [permissions.IsAdminUser()]

        return [permissions.IsAuthenticated(), IsAdminOrSelf()]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return User.objects.all()

        return User.objects.filter(id=user.id)