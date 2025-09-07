from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib import messages
from django.db import transaction
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product", "quantity", "price", "selected_size", "created_at"]
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "order_number",
        "user_info",
        "status",
        "total_amount",
        "items_count",
        "created_at",
        "status_actions",
    ]
    list_filter = ["status", "created_at", "updated_at"]
    search_fields = [
        "order_number",
        "user__username",
        "user__first_name",
        "user__last_name",
    ]
    readonly_fields = ["order_number", "created_at", "updated_at", "total_amount"]
    inlines = [OrderItemInline]
    actions = ["confirm_orders", "ship_orders", "deliver_orders", "cancel_orders"]

    fieldsets = (
        (
            "Основная информация",
            {"fields": ("order_number", "user", "status", "total_amount")},
        ),
        (
            "Информация о доставке",
            {"fields": ("shipping_address", "phone_number", "notes")},
        ),
        ("Даты", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    def user_info(self, obj):
        if obj.user:
            return f"{obj.user.first_name or obj.user.username or obj.user.telegram_id} (ID: {obj.user.telegram_id})"
        return "Неизвестный пользователь"

    user_info.short_description = "Пользователь"

    def items_count(self, obj):
        return obj.items.count()

    items_count.short_description = "Товаров"

    def status_actions(self, obj):
        if obj.status == "pending":
            return format_html(
                '<a class="button" href="{}">Подтвердить</a> '
                '<a class="button" href="{}">Отменить</a>',
                reverse("admin:orders_order_confirm", args=[obj.id]),
                reverse("admin:orders_order_cancel", args=[obj.id]),
            )
        elif obj.status == "confirmed":
            return format_html(
                '<a class="button" href="{}">Отправить</a>',
                reverse("admin:orders_order_ship", args=[obj.id]),
            )
        elif obj.status == "shipped":
            return format_html(
                '<a class="button" href="{}">Доставить</a>',
                reverse("admin:orders_order_deliver", args=[obj.id]),
            )
        return "-"

    status_actions.short_description = "Действия"

    def confirm_orders(self, request, queryset):
        with transaction.atomic():
            for order in queryset.filter(status="pending"):
                try:
                    # Проверяем доступность товаров
                    for item in order.items.all():
                        if item.product.stock_quantity < item.quantity:
                            messages.error(
                                request,
                                f"Недостаточно товара {item.product.team} (размер: {item.selected_size}). "
                                f"Доступно: {item.product.stock_quantity}, требуется: {item.quantity}",
                            )
                            return

                    # Обновляем статус заказа
                    order.status = "confirmed"
                    order.save()

                    # Уменьшаем остатки товаров
                    for item in order.items.all():
                        item.product.stock_quantity -= item.quantity
                        if item.product.stock_quantity <= 0:
                            item.product.is_available = False
                        item.product.save()

                    messages.success(request, f"Заказ {order.order_number} подтвержден")
                except Exception as e:
                    messages.error(
                        request,
                        f"Ошибка при подтверждении заказа {order.order_number}: {str(e)}",
                    )

    confirm_orders.short_description = "Подтвердить выбранные заказы"

    def ship_orders(self, request, queryset):
        updated = queryset.filter(status="confirmed").update(status="shipped")
        messages.success(request, f"Обновлено {updated} заказов в статус 'Отправлен'")

    ship_orders.short_description = "Отметить как отправленные"

    def deliver_orders(self, request, queryset):
        updated = queryset.filter(status="shipped").update(status="delivered")
        messages.success(request, f"Обновлено {updated} заказов в статус 'Доставлен'")

    deliver_orders.short_description = "Отметить как доставленные"

    def cancel_orders(self, request, queryset):
        with transaction.atomic():
            for order in queryset.filter(status="pending"):
                try:
                    # Возвращаем товары на склад
                    for item in order.items.all():
                        item.product.stock_quantity += item.quantity
                        if item.product.stock_quantity > 0:
                            item.product.is_available = True
                        item.product.save()

                    order.status = "cancelled"
                    order.save()
                    messages.success(request, f"Заказ {order.order_number} отменен")
                except Exception as e:
                    messages.error(
                        request,
                        f"Ошибка при отмене заказа {order.order_number}: {str(e)}",
                    )

    cancel_orders.short_description = "Отменить выбранные заказы"

    def get_urls(self):
        from django.urls import path

        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:order_id>/confirm/",
                self.admin_site.admin_view(self.confirm_order),
                name="orders_order_confirm",
            ),
            path(
                "<int:order_id>/cancel/",
                self.admin_site.admin_view(self.cancel_order),
                name="orders_order_cancel",
            ),
            path(
                "<int:order_id>/ship/",
                self.admin_site.admin_view(self.ship_order),
                name="orders_order_ship",
            ),
            path(
                "<int:order_id>/deliver/",
                self.admin_site.admin_view(self.deliver_order),
                name="orders_order_deliver",
            ),
        ]
        return custom_urls + urls

    def confirm_order(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            if order.status == "pending":
                with transaction.atomic():
                    # Проверяем доступность товаров
                    for item in order.items.all():
                        if item.product.stock_quantity < item.quantity:
                            messages.error(
                                request,
                                f"Недостаточно товара {item.product.team} (размер: {item.selected_size}). "
                                f"Доступно: {item.product.stock_quantity}, требуется: {item.quantity}",
                            )
                            return self.response_post_save_change(request, order)

                    # Обновляем статус заказа
                    order.status = "confirmed"
                    order.save()

                    # Уменьшаем остатки товаров
                    for item in order.items.all():
                        item.product.stock_quantity -= item.quantity
                        if item.product.stock_quantity <= 0:
                            item.product.is_available = False
                        item.product.save()

                    messages.success(request, f"Заказ {order.order_number} подтвержден")
            else:
                messages.warning(
                    request,
                    f"Заказ {order.order_number} уже не в статусе 'Ожидает подтверждения'",
                )
        except Order.DoesNotExist:
            messages.error(request, "Заказ не найден")
        except Exception as e:
            messages.error(request, f"Ошибка при подтверждении заказа: {str(e)}")

        return self.response_post_save_change(request, order)

    def cancel_order(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            if order.status == "pending":
                with transaction.atomic():
                    # Возвращаем товары на склад
                    for item in order.items.all():
                        item.product.stock_quantity += item.quantity
                        if item.product.stock_quantity > 0:
                            item.product.is_available = True
                        item.product.save()

                    order.status = "cancelled"
                    order.save()
                    messages.success(request, f"Заказ {order.order_number} отменен")
            else:
                messages.warning(
                    request,
                    f"Заказ {order.order_number} уже не в статусе 'Ожидает подтверждения'",
                )
        except Order.DoesNotExist:
            messages.error(request, "Заказ не найден")
        except Exception as e:
            messages.error(request, f"Ошибка при отмене заказа: {str(e)}")

        return self.response_post_save_change(request, order)

    def ship_order(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            if order.status == "confirmed":
                order.status = "shipped"
                order.save()
                messages.success(
                    request, f"Заказ {order.order_number} отмечен как отправленный"
                )
            else:
                messages.warning(
                    request, f"Заказ {order.order_number} не в статусе 'Подтвержден'"
                )
        except Order.DoesNotExist:
            messages.error(request, "Заказ не найден")
        except Exception as e:
            messages.error(request, f"Ошибка при обновлении статуса: {str(e)}")

        return self.response_post_save_change(request, order)

    def deliver_order(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            if order.status == "shipped":
                order.status = "delivered"
                order.save()
                messages.success(
                    request, f"Заказ {order.order_number} отмечен как доставленный"
                )
            else:
                messages.warning(
                    request, f"Заказ {order.order_number} не в статусе 'Отправлен'"
                )
        except Order.DoesNotExist:
            messages.error(request, "Заказ не найден")
        except Exception as e:
            messages.error(request, f"Ошибка при обновлении статуса: {str(e)}")

        return self.response_post_save_change(request, order)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        "order",
        "product",
        "quantity",
        "selected_size",
        "price",
        "created_at",
    ]
    list_filter = ["created_at", "selected_size"]
    search_fields = ["order__order_number", "product__team"]
    readonly_fields = [
        "order",
        "product",
        "quantity",
        "selected_size",
        "price",
        "created_at",
    ]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
