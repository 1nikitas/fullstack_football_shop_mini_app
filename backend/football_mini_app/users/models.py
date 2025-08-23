from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(
        self,
        telegram_id,
        username=None,
        first_name=None,
        last_name=None,
        phone_number=None,
    ):
        if not telegram_id:
            raise ValueError("Users must have a telegram_id")
        user = self.model(
            telegram_id=telegram_id,
            username=username,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
        )
        user.save(using=self._db)
        return user

    def create_superuser(self, telegram_id, username=None, password=None):
        user = self.create_user(telegram_id=telegram_id, username=username)
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    telegram_id = models.BigIntegerField(
        unique=True, verbose_name="Telegram User ID", null=True, blank=True
    )
    username = models.CharField(
        max_length=255, null=True, blank=True, verbose_name="Telegram username"
    )
    first_name = models.CharField(
        max_length=255, null=True, blank=True, verbose_name="Имя"
    )
    last_name = models.CharField(
        max_length=255, null=True, blank=True, verbose_name="Фамилия"
    )
    phone_number = models.CharField(
        max_length=20, null=True, blank=True, verbose_name="Номер телефона"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Дата регистрации"
    )
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    is_admin = models.BooleanField(default=False, verbose_name="Администратор")

    objects = UserManager()

    USERNAME_FIELD = "telegram_id"

    def __str__(self):
        return (
            f"{self.first_name} {self.last_name} (@{self.username})"
            if self.username
            else f"User {self.telegram_id}"
        )

    @property
    def is_staff(self):
        return self.is_admin
