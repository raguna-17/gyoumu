import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from .models import Project, Task

@pytest.mark.django_db
def test_project_creation_success():
    """正常系: Project 作成"""
    client = APIClient()
    user = User.objects.create_user(email="user@example.com", password="pass")
    client.force_authenticate(user=user)
    data = {"name": "Test Project", "description": "説明"}
    url = reverse("project-list")
    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert Project.objects.filter(name="Test Project").exists()

@pytest.mark.django_db
def test_task_creation_success():
    """正常系: Task 作成"""
    client = APIClient()
    user = User.objects.create_user(email="user@example.com", password="pass")
    client.force_authenticate(user=user)

    project = Project.objects.create(name="P1", description="Desc")
    data = {
        "project_id": project.id,
        "name": "Task1",
        "description": "Task説明",
        "assigned_to": user.id,
        "status": "未着手",
        "progress": 0
    }
    url = reverse("task-list")
    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    task = Task.objects.get(name="Task1")
    assert task.project == project
    assert task.assigned_to == user

@pytest.mark.django_db
def test_task_creation_fail_invalid_status():
    """異常系: Task status が不正"""
    client = APIClient()
    user = User.objects.create_user(email="user@example.com", password="pass")
    client.force_authenticate(user=user)
    project = Project.objects.create(name="P2", description="Desc")

    data = {"project_id": project.id, "name": "BadTask", "status": "invalid"}
    url = reverse("task-list")
    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "status" in response.data

@pytest.mark.django_db
def test_task_update_progress_success():
    """正常系: Task progress 更新"""
    client = APIClient()
    user = User.objects.create_user(email="user@example.com", password="pass")
    client.force_authenticate(user=user)
    project = Project.objects.create(name="P3", description="Desc")
    task = Task.objects.create(project=project, name="TaskUpdate", assigned_to=user)

    url = reverse("task-detail", args=[task.id])
    response = client.patch(url, {"progress": 50}, format="json")
    assert response.status_code == status.HTTP_200_OK
    task.refresh_from_db()
    assert task.progress == 50

@pytest.mark.django_db
def test_task_delete_success():
    """正常系: Task 削除"""
    client = APIClient()
    user = User.objects.create_user(email="user@example.com", password="pass")
    client.force_authenticate(user=user)
    project = Project.objects.create(name="P4", description="Desc")
    task = Task.objects.create(project=project, name="TaskDelete", assigned_to=user)

    url = reverse("task-detail", args=[task.id])
    response = client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Task.objects.filter(id=task.id).exists()

@pytest.mark.django_db
def test_task_creation_fail_no_project():
    """異常系: Task 作成時に project_id がない"""
    client = APIClient()
    user = User.objects.create_user(email="user@example.com", password="pass")
    client.force_authenticate(user=user)

    data = {"name": "NoProjectTask"}
    url = reverse("task-list")
    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "project" in response.data