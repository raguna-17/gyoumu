from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from projects.models import Project
from .models import Task
from datetime import date, timedelta


class BaseTaskTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="pass123"
        )
        self.client.force_authenticate(user=self.user)

        self.project = Project.objects.create(
            name="Test Project",
            description="desc",
            owner=self.user
        )

        self.base_url = f"/api/v1/projects/{self.project.id}/tasks/"


# ----------------------------
# CREATE
# ----------------------------
class TestTaskCreate(BaseTaskTest):

    def test_create_task_success(self):
        data = {
            "name": "Task1",
            "description": "desc",
            "status": "todo",
            "progress": 0,
            "due_date": (date.today() + timedelta(days=1))
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)

    def test_create_task_invalid_name(self):
        data = {
            "name": "a",
            "status": "todo",
            "progress": 0
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_create_task_invalid_progress(self):
        data = {
            "name": "Task",
            "status": "todo",
            "progress": 200
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("progress", response.data)

    def test_create_task_past_due_date(self):
        data = {
            "name": "Task",
            "status": "todo",
            "progress": 0,
            "due_date": (date.today() - timedelta(days=1))
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("due_date", response.data)

    def test_create_task_invalid_status(self):
        data = {
            "name": "Task",
            "status": "invalid",
            "progress": 0
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("status", response.data)

    def test_create_done_requires_100_progress(self):
        data = {
            "name": "Task",
            "status": "done",
            "progress": 50
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ----------------------------
# LIST
# ----------------------------
class TestTaskList(BaseTaskTest):

    def test_list_tasks_only_in_project(self):
        Task.objects.create(
            name="Task1",
            project=self.project,
            created_by=self.user
        )

        other_user = User.objects.create_user(
            email="other@example.com",
            password="pass123"
        )

        other_project = Project.objects.create(
            name="Other",
            description="desc",
            owner=other_user
        )

        Task.objects.create(
            name="Other Task",
            project=other_project,
            created_by=other_user
        )

        response = self.client.get(self.base_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)




# ----------------------------
# DELETE
# ----------------------------
class TestTaskDelete(BaseTaskTest):

    def setUp(self):
        super().setUp()
        self.task = Task.objects.create(
            name="DeleteMe",
            project=self.project,
            created_by=self.user
        )
        self.url = f"{self.base_url}{self.task.id}/"

    def test_delete_task_success(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)