from django.db import models
from django.conf import settings
from products.models import Product
import uuid
from django.utils import timezone


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Ожидает подтверждения"),
        ("confirmed", "Подтвержден"),
        ("shipped", "Отправлен"),
        ("delivered", "Доставлен"),
        ("cancelled", "Отменен"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="orders",
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
    )
    order_number = models.CharField(
        max_length=50, unique=True, default="", verbose_name="Номер заказа"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        verbose_name="Статус заказа",
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, verbose_name="Общая сумма"
    )
    shipping_address = models.TextField(
        null=True, blank=True, verbose_name="Адрес доставки"
    )
    phone_number = models.CharField(
        max_length=20, null=True, blank=True, verbose_name="Телефон для связи"
    )
    notes = models.TextField(
        null=True, blank=True, verbose_name="Дополнительные заметки"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Заказ {self.order_number} от {self.user}"

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, related_name="items", on_delete=models.CASCADE, verbose_name="Заказ"
    )
    product = models.ForeignKey(
        Product,
        related_name="order_items",
        on_delete=models.CASCADE,
        verbose_name="Товар",
    )
    quantity = models.IntegerField(verbose_name="Количество")
    price = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Цена на момент заказа", default=0
    )
    selected_size = models.CharField(
        max_length=10, verbose_name="Выбранный размер", default=""
    )
    created_at = models.DateTimeField(
        verbose_name="Дата создания",
        default=timezone.now,
    )

    def __str__(self):
        return f"{self.quantity}x {self.product.team} ({self.selected_size})"

    class Meta:
        verbose_name = "Элемент заказа"
        verbose_name_plural = "Элементы заказа"
