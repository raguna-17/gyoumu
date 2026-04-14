from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "error": "validation_error",
                    "fields": serializer.errors
                },
                status=400
            )

        self.perform_create(serializer)

        return Response(
            {
                "message": "user_created",
                "user": serializer.data
            },
            status=201
        )

    def perform_create(self, serializer):
        serializer.save()


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return User.objects.all()


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user