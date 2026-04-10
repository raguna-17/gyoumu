from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import ProjectViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

nested_router = NestedDefaultRouter(router, r'projects', lookup='project')
nested_router.register(r'tasks', TaskViewSet, basename='project-tasks')

urlpatterns = router.urls + nested_router.urls