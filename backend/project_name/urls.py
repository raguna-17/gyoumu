from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    # schema / docs
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/v1/docs/", SpectacularSwaggerView.as_view(url_name="schema")),

    # auth
    path("api/v1/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

    # apps
    path("api/v1/users/", include("users.urls")),
    path("api/v1/projects/", include("projects.urls")),
]