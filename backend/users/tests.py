import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User

def get_token(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

@pytest.mark.django_db
def test_user_create_success():
    client = APIClient()
    url = reverse("user-create")

    res = client.post(url, {
        "email": "test@example.com",
        "password": "1234"
    })

    assert res.status_code == status.HTTP_201_CREATED
    assert User.objects.count() == 1

@pytest.mark.django_db
def test_user_create_duplicate_email():
    User.objects.create_user(email="a@example.com", password="1234")

    client = APIClient()
    url = reverse("user-create")

    res = client.post(url, {
        "email": "a@example.com",
        "password": "9999"
    })

    assert res.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_me_unauthorized():
    client = APIClient()
    url = reverse("me")

    res = client.get(url)

    assert res.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_list_forbidden():
    user = User.objects.create_user(
        email="user@example.com",
        password="1234"
    )

    client = APIClient()
    token = get_token(user)

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    url = reverse("user-list")

    res = client.get(url)

    assert res.status_code == status.HTTP_403_FORBIDDEN