from django.urls import path
from .views import UserCreateView, UserListView, MeView

urlpatterns = [
    # ユーザー作成
    path("", UserCreateView.as_view(), name="user-create"),

    # ユーザー一覧（管理者のみ）
    path("all/", UserListView.as_view(), name="user-list"),

    # 自分自身
    path("me/", MeView.as_view(), name="me"),
]