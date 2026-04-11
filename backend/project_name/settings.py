import os
from pathlib import Path
from datetime import timedelta
import dj_database_url


BASE_DIR = Path(__file__).resolve().parent.parent


# =========================
# 環境管理
# =========================
ENV = os.getenv("ENV", "development")
DEBUG = ENV != "production"


# =========================
# セキュリティ
# =========================
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-default-key")

ALLOWED_HOSTS = os.getenv(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1"
).split(",")


# =========================
# アプリ定義
# =========================
INSTALLED_APPS = [
    # Django標準
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # 外部
    "corsheaders",
    "rest_framework",
    "drf_spectacular",

    # 自作
    "users",
    "tasks",
    "projects",
]


AUTH_USER_MODEL = "users.User"


# =========================
# ミドルウェア
# =========================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =========================
# CORS
# =========================
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

CORS_ALLOW_ALL_ORIGINS = False


# =========================
# URL / WSGI
# =========================
ROOT_URLCONF = "project_name.urls"
WSGI_APPLICATION = "project_name.wsgi.application"


# =========================
# テンプレート
# =========================
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# =========================
# DRF設定
# =========================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}


# =========================
# JWT設定
# =========================
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),

    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
}


# =========================
# DB設定（環境分離の核心）
# =========================
if ENV == "production":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
        "default": dj_database_url.config(
            default=os.getenv(
                "DATABASE_URL",
                "postgres://postgres:postgres@db:5432/postgres"
            ),
            conn_max_age=600,
        )
    }


# =========================
# パスワード
# =========================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# =========================
# 国際化
# =========================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Tokyo"
USE_I18N = True
USE_TZ = True


# =========================
# 静的ファイル
# =========================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"


# =========================
# デフォルトキー
# =========================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"