from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from .models import Project


class BaseProjectTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.base_url = "/api/v1/projects/"


# ----------------------------
# CREATE
# ----------------------------
class TestProjectCreate(BaseProjectTest):

    def test_create_project_success(self):
        data = {
            "name": "Test Project",
            "description": "Test Description"
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 1)

    def test_create_project_invalid_name(self):
        data = {
            "name": "a",  # short
            "description": "Test"
        }

        response = self.client.post(self.base_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)


# ----------------------------
# LIST
# ----------------------------
class TestProjectList(BaseProjectTest):

    def test_list_only_own_projects(self):
        Project.objects.create(
            name="My Project",
            description="desc",
            owner=self.user
        )

        other_user = User.objects.create_user(
            username="other",
            password="pass123"
        )

        Project.objects.create(
            name="Other Project",
            description="desc",
            owner=other_user
        )

        response = self.client.get(self.base_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


# ----------------------------
# DELETE
# ----------------------------
class TestProjectDelete(BaseProjectTest):

    def setUp(self):
        super().setUp()
        self.project = Project.objects.create(
            name="ToDelete",
            description="desc",
            owner=self.user
        )
        self.url = f"{self.base_url}{self.project.id}/"

    def test_delete_project_success(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)