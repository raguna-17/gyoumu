from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):#ユーザー作成のルールを統一するクラス
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("メールアドレス必須")

        email = self.normalize_email(email)#大文字小文字とかを統一
        user = self.model(email=email, **extra_fields)
        if not password:
            raise ValueError("password is required")
        user.set_password(password)#パスワードを「ハッシュ化」する
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)#強制的に管理者にする

        if extra_fields.get("is_staff") is not True:
            raise ValueError("is_staff=Trueが必要")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("is_superuser=Trueが必要")

        return self.create_user(email, password, **extra_fields)#普通の作成処理を再利用


class User(AbstractBaseUser, PermissionsMixin):#Djangoの標準Userを捨ててる

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50,blank=True)
    department = models.CharField(
        max_length=50,
        blank=True,
        choices=[("dev","Development"),("sales","Sales")]
    )#所属部署を固定値で管理

    is_active = models.BooleanField(default=True)#アカウント有効かどうか
    is_staff = models.BooleanField(default=False)#管理画面入れるか

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"#ログインIDはemail
    REQUIRED_FIELDS = ["name"]#createsuperuser時に必要な項目

    objects = UserManager()#Djangoの標準Userを“置き換える”のではなく、“安全なルールごと再定義している

    def __str__(self):
        return self.email