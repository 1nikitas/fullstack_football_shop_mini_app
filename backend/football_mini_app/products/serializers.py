from rest_framework import serializers
from .models import Product, Image, CartItem, Favorite


class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ["id", "image", "image_url", "created_at"]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["product", "image"]


class ProductSerializer(serializers.ModelSerializer):
    images = ImageSerializer(source="images_set", many=True, read_only=True)
    images_count = serializers.SerializerMethodField()
    # Добавляем поля для совместимости с фронтендом
    name = serializers.SerializerMethodField()
    manufacturer = serializers.CharField(source="brand")
    league = serializers.CharField(source="team")
    type = serializers.CharField(source="kit_type")
    description = serializers.CharField(source="features")
    withPlayer = serializers.SerializerMethodField()
    badges = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "team",
            "national_team",
            "brand",
            "manufacturer",
            "league",
            "type",
            "season",
            "kit_type",
            "condition",
            "price",
            "size",
            "color",
            "features",
            "description",
            "withPlayer",
            "contacts",
            "hashtags",
            "post_url",
            "is_available",
            "stock_quantity",
            "created_at",
            "updated_at",
            "images",
            "images_count",
            "badges",
        ]

    def get_images_count(self, obj):
        return obj.images_set.count()

    def get_name(self, obj):
        return f"{obj.team} ({obj.season})"

    def get_withPlayer(self, obj):
        # По умолчанию false, можно настроить логику
        return False

    def get_badges(self, obj):
        # Создаем бейджи на основе характеристик товара
        badges = []
        if obj.condition == "Новая":
            badges.append({"type": "condition", "value": "Новая"})
        if obj.brand:
            badges.append({"type": "brand", "value": obj.brand})
        if obj.season:
            badges.append({"type": "season", "value": obj.season})
        return badges


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания и обновления товаров"""

    class Meta:
        model = Product
        fields = [
            "team",
            "national_team",
            "brand",
            "season",
            "kit_type",
            "condition",
            "price",
            "size",
            "color",
            "features",
            "contacts",
            "hashtags",
            "post_url",
            "is_available",
            "stock_quantity",
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "quantity",
            "selected_size",
            "created_at",
            "updated_at",
        ]


class CartItemCreateSerializer(serializers.ModelSerializer):
    telegram_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ["product", "quantity", "selected_size", "telegram_id"]


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    telegram_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "product", "created_at", "telegram_id"]
