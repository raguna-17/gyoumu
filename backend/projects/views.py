from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from .models import Project
from .serializers import (
    ProjectSerializer,
    ProjectCreateSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]#ログインしてる人だけアクセスできる

    def get_queryset(self):#自分のプロジェクトしか“取得・操作できない”
        return Project.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":#「create（POST）が呼ばれたとき
            return ProjectCreateSerializer
        return ProjectSerializer

#self = クラスのインスタンス
#self.request → リクエスト情報
#self.request.user → ログインユーザー
#self.action → 今の操作（createとか）
#self.kwargs → URLパラメータ