from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "telegram_id",
            "username",
            "first_name",
            "last_name",
            "phone_number",
            "created_at",
            "updated_at",
            "is_active",
            "is_admin",
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["telegram_id", "username", "first_name", "last_name", "phone_number"]
