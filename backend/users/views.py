from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class UserCreateView(generics.CreateAPIView):#「POST専用の登録API」
    """
    ユーザー登録専用API
    """
    queryset = User.objects.all()#DRFの仕様的に必要なだけ
    serializer_class = UserCreateSerializer#emailチェックpassword処理
    permission_classes = [permissions.AllowAny]#ログインしてなくても登録OK


class UserListView(generics.ListAPIView):#GETで一覧返すだけのView
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]#これ外すと全ユーザー情報公開API完成（地獄

    def get_queryset(self):
        return User.objects.all()


class MeView(generics.RetrieveAPIView):#単一オブジェクト取得View
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):#URLのID無視,「他人の情報にアクセスする手段が存在しない」
        return self.request.user