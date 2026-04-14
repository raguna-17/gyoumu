from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class UserCreateView(generics.CreateAPIView):#CreateAPIViewでも汎用設計の都合で queryset が必要なだけで、登録ロジックには直接関与しない
    """
    ユーザー登録専用API
    """
    queryset = User.objects.all()#DRFの仕様的に必要なだけ
    serializer_class = UserCreateSerializer#emailチェックpassword処理
    permission_classes = [permissions.AllowAny]#ログインしてなくても登録OK
    def perform_create(self, serializer):
        print("🔥 HIT CREATE VIEW")
        print("DATA:", serializer.validated_data)
        serializer.save()

class UserListView(generics.ListAPIView):#GETで一覧返すだけのView
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]#これ外すと全ユーザー情報公開API完成（地獄

    def get_queryset(self):
        return User.objects.all()


class MeView(generics.RetrieveAPIView):#単一オブジェクト取得View
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):#URLのID無視,「他人の情報にアクセスする手段が存在しない」
        return self.request.user#IDベース設計を捨ててユーザーコンテキスト直参照にしてるのが本質