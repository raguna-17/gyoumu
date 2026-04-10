from rest_framework import viewsets, permissions
from .models import Project,Task
from .serializers import ProjectSerializer, ProjectCreateSerializer, TaskSerializer, TaskCreateSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):#操作によってSerializerを切り替える
        if self.action == "create":
            return ProjectCreateSerializer
        return ProjectSerializer

    def perform_create(self, serializer):#保存時にownerを強制注入
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # 自分のプロジェクトだけ見せる設計（重要）
        return Project.objects.filter(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # project配下のタスクだけ返す
        project_id = self.kwargs.get("project_pk")

        return Task.objects.filter(
            project_id=project_id,
            project__owner=self.request.user#他人のプロジェクト経由のタスクを完全遮断
        )

    def get_serializer_class(self):
        if self.action == "create":
            return TaskCreateSerializer
        return TaskSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        project_id = self.kwargs.get("project_pk")#URLからproject取得
        project = Project.objects.filter(
            id=project_id,
            owner=self.request.user
        ).first()#プロジェクト取得かつ「自分のものだけ」

        context["project"] = project
        return context

    def perform_create(self, serializer):
        # contextでproject渡してるのでここは薄くてOK
        serializer.save(created_by=self.request.user)