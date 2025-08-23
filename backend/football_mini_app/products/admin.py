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
        "is_available",
        "stock_quantity",
        "images_count",
    ]
    list_filter = ["brand", "season", "condition", "is_available", "created_at"]
    search_fields = ["team", "brand", "season", "contacts"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ImageInline]

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

    def images_count(self, obj):
        count = obj.images_set.count()
        if count > 0:
            return format_html('<span style="color: green;">{} фото</span>', count)
        return format_html('<span style="color: red;">Нет фото</span>')

    images_count.short_description = "Количество фото"


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
    list_display = ["user", "product", "quantity", "selected_size", "created_at"]
    list_filter = ["selected_size", "created_at", "product__brand"]
    search_fields = ["user__first_name", "user__last_name", "product__team"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ["user", "product", "created_at"]
    list_filter = ["created_at", "product__brand"]
    search_fields = ["user__first_name", "user__last_name", "product__team"]
    readonly_fields = ["created_at"]
