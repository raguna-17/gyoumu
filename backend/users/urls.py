from django.urls import path
from .views import UserCreateView, UserListView, MeView

urlpatterns = [
    path("users/", UserCreateView.as_view(), name="user-create"),
    path("users/list/", UserListView.as_view(), name="user-list"),
    path("me/", MeView.as_view(), name="me"),
]