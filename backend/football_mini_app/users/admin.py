from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
        "telegram_id",
        "username",
        "full_name",
        "phone_number",
        "orders_count",
        "cart_items_count",
        "favorites_count",
        "total_spent",
        "created_at",
    ]
    list_filter = ["is_active", "is_admin", "created_at"]
    search_fields = [
        "telegram_id",
        "username",
        "first_name",
        "last_name",
        "phone_number",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
        "orders_count",
        "cart_items_count",
        "favorites_count",
        "total_spent",
    ]

    fieldsets = (
        (
            "Основная информация",
            {
                "fields": (
                    "telegram_id",
                    "username",
                    "first_name",
                    "last_name",
                    "phone_number",
                )
            },
        ),
        (
            "Статистика",
            {
                "fields": (
                    "orders_count",
                    "cart_items_count",
                    "favorites_count",
                    "total_spent",
                ),
                "classes": ("collapse",),
            },
        ),
        ("Права доступа", {"fields": ("is_active", "is_admin")}),
        ("Даты", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    def full_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        elif obj.first_name:
            return obj.first_name
        elif obj.username:
            return obj.username
        return f"ID: {obj.telegram_id}"

    full_name.short_description = "Полное имя"

    def orders_count(self, obj):
        count = obj.orders.count()
        if count > 0:
            return format_html('<span style="color: blue;">{}</span>', count)
        return "0"

    orders_count.short_description = "Заказов"

    def cart_items_count(self, obj):
        count = obj.cart_items.count()
        if count > 0:
            return format_html('<span style="color: orange;">{}</span>', count)
        return "0"

    cart_items_count.short_description = "В корзине"

    def favorites_count(self, obj):
        count = obj.favorites.count()
        if count > 0:
            return format_html('<span style="color: red;">{}</span>', count)
        return "0"

    favorites_count.short_description = "В избранном"

    def total_spent(self, obj):
        total = (
            obj.orders.filter(
                status__in=["confirmed", "shipped", "delivered"]
            ).aggregate(total=Sum("total_amount"))["total"]
            or 0
        )
        if total > 0:
            return format_html('<span style="color: green;">{:.2f} ₽</span>', total)
        return "0 ₽"

    total_spent.short_description = "Всего потрачено"

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(
                orders_count=Count("orders"),
                cart_items_count=Count("cart_items"),
                favorites_count=Count("favorites"),
            )
        )
