from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Image, CartItem, Favorite


class ImageInline(admin.TabularInline):
    model = Image
    extra = 1
    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="100" height="100" style="object-fit: cover;" />',
                obj.image.url,
            )
        return "Нет изображения"

    image_preview.short_description = "Предпросмотр"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "team",
        "brand",
        "season",
        "price",
        "stock_status",
        "images_count",
        "created_at",
    ]
    list_filter = ["brand", "season", "condition", "is_available", "created_at"]
    search_fields = ["team", "brand", "season", "contacts"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ImageInline]
    actions = ["mark_as_available", "mark_as_unavailable"]

    fieldsets = (
        (
            "Основная информация",
            {"fields": ("team", "national_team", "brand", "season", "kit_type")},
        ),
        (
            "Характеристики",
            {"fields": ("condition", "price", "size", "color", "features")},
        ),
        ("Контакты и ссылки", {"fields": ("contacts", "hashtags", "post_url")}),
        ("Наличие", {"fields": ("is_available", "stock_quantity")}),
        (
            "Системная информация",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def stock_status(self, obj):
        if obj.stock_quantity <= 0:
            return format_html(
                '<span style="color: red; font-weight: bold;">Нет в наличии</span>'
            )
        elif obj.stock_quantity <= 3:
            return format_html(
                '<span style="color: orange; font-weight: bold;">Осталось: {}</span>',
                obj.stock_quantity,
            )
        else:
            return format_html(
                '<span style="color: green;">В наличии: {}</span>', obj.stock_quantity
            )

    stock_status.short_description = "Статус остатков"

    def images_count(self, obj):
        count = obj.images_set.count()
        if count > 0:
            return format_html('<span style="color: green;">{} фото</span>', count)
        return format_html('<span style="color: red;">Нет фото</span>')

    images_count.short_description = "Количество фото"

    def mark_as_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f"Обновлено {updated} товаров как доступных")

    mark_as_available.short_description = "Отметить как доступные"

    def mark_as_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f"Обновлено {updated} товаров как недоступных")

    mark_as_unavailable.short_description = "Отметить как недоступные"


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ["product", "image_preview", "created_at"]
    list_filter = ["created_at", "product__brand"]
    search_fields = ["product__team", "product__brand"]
    readonly_fields = ["image_preview", "created_at"]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="150" height="150" style="object-fit: cover;" />',
                obj.image.url,
            )
        return "Нет изображения"

    image_preview.short_description = "Предпросмотр"


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = [
        "user_info",
        "product_info",
        "quantity",
        "selected_size",
        "created_at",
    ]
    list_filter = ["selected_size", "created_at", "product__brand"]
    search_fields = ["user__first_name", "user__last_name", "product__team"]
    readonly_fields = ["created_at", "updated_at"]
    list_per_page = 50

    def user_info(self, obj):
        if obj.user:
            telegram_id = getattr(obj.user, "telegram_id", "N/A")
            name = obj.user.first_name or obj.user.username or f"ID: {telegram_id}"
            return f"{name} (TG: {telegram_id})"
        return "Неизвестный пользователь"

    user_info.short_description = "Пользователь"

    def product_info(self, obj):
        if obj.product:
            return f"{obj.product.team} ({obj.product.brand}, {obj.product.season})"
        return "Товар не найден"

    product_info.short_description = "Товар"


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ["user_info", "product_info", "created_at"]
    list_filter = ["created_at", "product__brand"]
    search_fields = ["user__first_name", "user__last_name", "product__team"]
    readonly_fields = ["created_at"]
    list_per_page = 50

    def user_info(self, obj):
        if obj.user:
            telegram_id = getattr(obj.user, "telegram_id", "N/A")
            name = obj.user.first_name or obj.user.username or f"ID: {telegram_id}"
            return f"{name} (TG: {telegram_id})"
        return "Неизвестный пользователь"

    user_info.short_description = "Пользователь"

    def product_info(self, obj):
        if obj.product:
            return f"{obj.product.team} ({obj.product.brand}, {obj.product.season})"
        return "Товар не найден"

    product_info.short_description = "Товар"
