from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class UserCreateView(generics.CreateAPIView):#「POST専用の登録API」
    """
    ユーザー登録専用API
    """
    queryset = User.objects.all()#どのテーブルを扱うか（内部的に必要）
    serializer_class = UserCreateSerializer#入力データの検証＆作成ロジック担当
    permission_classes = [permissions.AllowAny]#ログインしてなくても登録OK


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