from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=["post"])
    def register_telegram(self, request):
        """Регистрация пользователя Telegram"""
        telegram_id = request.data.get("telegram_id")
        username = request.data.get("username")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        phone_number = request.data.get("phone_number")

        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем, существует ли пользователь
        user, created = User.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "phone_number": phone_number,
            },
        )

        if not created:
            # Обновляем данные пользователя
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.phone_number = phone_number
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Получить информацию о текущем пользователе"""
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        return Response(
            {"error": "Пользователь не аутентифицирован"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
