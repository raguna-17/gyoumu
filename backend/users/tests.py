import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

@pytest.mark.django_db
def test_user_creation_success():
    """正常系: ユーザー登録が成功する"""
    client = APIClient()
    data = {"email": "test@example.com", "password": "secure123"}
    url = reverse("user-list")  # urls.pyでのViewSetのbasenameが'user'の場合
    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(email="test@example.com").exists()
    user = User.objects.get(email="test@example.com")
    assert user.role == "user"
    assert user.is_staff is False

@pytest.mark.django_db
def test_user_creation_fail_no_password():
    """異常系: パスワードなしはバリデーションエラー"""
    client = APIClient()
    data = {"email": "fail@example.com"}
    url = reverse("user-list")
    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.data

@pytest.mark.django_db
def test_user_creation_fail_short_password():
    """異常系: パスワード3文字未満はエラー"""
    client = APIClient()
    data = {"email": "short@example.com", "password": "12"}
    url = reverse("user-list")
    response = client.post(url, data, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.data

@pytest.mark.django_db
def test_user_list_access():
    """正常系: staff は全ユーザー閲覧可能"""
    staff = User.objects.create_user(email="staff@example.com", password="pass", is_staff=True)
    User.objects.create_user(email="user1@example.com", password="pass")
    User.objects.create_user(email="user2@example.com", password="pass")

    client = APIClient()
    client.force_authenticate(user=staff)
    url = reverse("user-list")
    response = client.get(url)

    assert response.status_code == 200
    assert len(response.data) >= 3  # staff は全員取得できる

@pytest.mark.django_db
def test_user_list_access_normal_user():
    """正常系: 一般ユーザーは自分のみ閲覧可能"""
    user = User.objects.create_user(email="normal@example.com", password="pass")
    other_user = User.objects.create_user(email="other@example.com", password="pass")

    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse("user-list")
    response = client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["email"] == "normal@example.com"