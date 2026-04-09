from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema')),

    # JWT認証
    path("api/v1/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

    # ユーザー管理API
    path("api/v1/", include("users.urls")),

    # タスク＆プロジェクトAPI
    path("api/v1/", include("tasks.urls")),

    # ダッシュボードAPI（今後追加予定）
    #path("api/v1/", include("dashboard.urls")),
]