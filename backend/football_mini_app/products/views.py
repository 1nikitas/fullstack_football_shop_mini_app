from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Product, Image, CartItem, Favorite
from users.models import User
from .serializers import (
    ProductSerializer,
    ProductCreateUpdateSerializer,
    ImageSerializer,
    ImageUploadSerializer,
    CartItemSerializer,
    CartItemCreateSerializer,
    FavoriteSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ProductCreateUpdateSerializer
        return ProductSerializer

    def get_queryset(self):
        # Для получения всех товаров (каталог) не применяем фильтр is_available
        if self.action == "list":
            queryset = Product.objects.all()
        else:
            queryset = Product.objects.filter(is_available=True)

            # Фильтрация для совместимости с фронтендом
        type_filter = self.request.query_params.get("type", None)
        manufacturer = self.request.query_params.get("manufacturer", None)
        league = self.request.query_params.get("league", None)
        season = self.request.query_params.get("season", None)
        condition = self.request.query_params.get("condition", None)
        size = self.request.query_params.get("size", None)
        min_price = self.request.query_params.get("min_price", None)
        max_price = self.request.query_params.get("max_price", None)
        search = self.request.query_params.get("search", None)

        if type_filter:
            queryset = queryset.filter(kit_type__icontains=type_filter)
        if manufacturer:
            queryset = queryset.filter(brand__icontains=manufacturer)
        if league:
            queryset = queryset.filter(team__icontains=league)
        if season:
            queryset = queryset.filter(season__icontains=season)
        if condition:
            queryset = queryset.filter(condition__icontains=condition)
        if size:
            queryset = queryset.filter(size__icontains=size)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if search:
            queryset = queryset.filter(
                Q(team__icontains=search)
                | Q(brand__icontains=search)
                | Q(season__icontains=search)
                | Q(kit_type__icontains=search)
            )

        return queryset

    @action(detail=False, methods=["get"])
    def filter_options(self, request):
        """Получить опции для фильтров"""
        products = Product.objects.filter(is_available=True)

        return Response(
            {
                "type": list(products.values_list("kit_type", flat=True).distinct()),
                "manufacturer": list(
                    products.values_list("brand", flat=True).distinct()
                ),
                "league": list(products.values_list("team", flat=True).distinct()),
                "season": list(products.values_list("season", flat=True).distinct()),
                "condition": list(
                    products.values_list("condition", flat=True).distinct()
                ),
                "size": ["XS", "S", "M", "L", "XL", "XXL"],  # Стандартные размеры
            }
        )

    @action(detail=True, methods=["post"])
    def upload_image(self, request, pk=None):
        """Загрузить изображение для товара"""
        product = self.get_object()

        if "image" not in request.FILES:
            return Response(
                {"error": "Файл изображения не предоставлен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ImageUploadSerializer(
            data={"product": product.id, "image": request.FILES["image"]}
        )

        if serializer.is_valid():
            image = serializer.save()
            response_serializer = ImageSerializer(image, context={"request": request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def images(self, request, pk=None):
        """Получить все изображения товара"""
        product = self.get_object()
        images = product.images_set.all()
        serializer = ImageSerializer(images, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["delete"], url_path="images/(?P<image_id>[^/.]+)")
    def delete_image(self, request, pk=None, image_id=None):
        """Удалить изображение товара"""
        product = self.get_object()

        try:
            image = product.images_set.get(id=image_id)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Image.DoesNotExist:
            return Response(
                {"error": "Изображение не найдено"}, status=status.HTTP_404_NOT_FOUND
            )


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "create":
            return ImageUploadSerializer
        return ImageSerializer

    def get_queryset(self):
        queryset = Image.objects.all()
        product_id = self.request.query_params.get("product_id", None)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.AllowAny]  # Разрешаем доступ для Telegram WebApp

    def get_queryset(self):
        # Получаем telegram_id из query параметров
        telegram_id = self.request.query_params.get("telegram_id")
        if telegram_id:
            try:
                user = User.objects.get(telegram_id=telegram_id)
                return CartItem.objects.filter(user=user)
            except User.DoesNotExist:
                return CartItem.objects.none()
        return CartItem.objects.none()

    def get_serializer_class(self):
        if self.action == "create":
            return CartItemCreateSerializer
        return CartItemSerializer

    def perform_create(self, serializer):
        # Получаем telegram_id из данных запроса
        telegram_id = self.request.data.get("telegram_id")
        if telegram_id:
            user, created = User.objects.get_or_create(telegram_id=telegram_id)
            serializer.save(user=user)

    @action(detail=False, methods=["delete"])
    def clear(self, request):
        """Очистить корзину"""
        telegram_id = request.query_params.get("telegram_id")
        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(telegram_id=telegram_id)
            CartItem.objects.filter(user=user).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"])
    def by_telegram_id(self, request):
        """Получить корзину по telegram_id"""
        telegram_id = request.query_params.get("telegram_id")
        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(telegram_id=telegram_id)
            cart_items = CartItem.objects.filter(user=user)
            serializer = CartItemSerializer(
                cart_items, many=True, context={"request": request}
            )
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response([])


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.AllowAny]  # Разрешаем доступ для Telegram WebApp

    def get_queryset(self):
        # Получаем telegram_id из query параметров
        telegram_id = self.request.query_params.get("telegram_id")
        if telegram_id:
            try:
                user = User.objects.get(telegram_id=telegram_id)
                return Favorite.objects.filter(user=user)
            except User.DoesNotExist:
                return Favorite.objects.none()
        return Favorite.objects.none()

    def perform_create(self, serializer):
        # Получаем telegram_id из данных запроса
        telegram_id = self.request.data.get("telegram_id")
        if telegram_id:
            user, created = User.objects.get_or_create(telegram_id=telegram_id)
            serializer.save(user=user)

    @action(detail=True, methods=["get"])
    def check(self, request, pk=None):
        """Проверить, есть ли товар в избранном"""
        telegram_id = request.query_params.get("telegram_id")
        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(telegram_id=telegram_id)
            is_favorite = Favorite.objects.filter(user=user, product_id=pk).exists()
            return Response({"is_favorite": is_favorite})
        except User.DoesNotExist:
            return Response({"is_favorite": False})

    @action(detail=False, methods=["get"])
    def by_telegram_id(self, request):
        """Получить избранные товары по telegram_id"""
        telegram_id = request.query_params.get("telegram_id")
        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(telegram_id=telegram_id)
            favorites = Favorite.objects.filter(user=user)
            serializer = FavoriteSerializer(
                favorites, many=True, context={"request": request}
            )
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response([])
