from django.db import models
from django.conf import settings

# Create your models here.


class Product(models.Model):
    team = models.CharField(max_length=255, verbose_name="Команда")
    national_team = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Сборная"
    )
    league = models.CharField(max_length=255, blank=True, null=True, verbose_name="Лига")
    brand = models.CharField(max_length=100, verbose_name="Бренд")
    season = models.CharField(max_length=50, verbose_name="Сезон")
    kit_type = models.CharField(max_length=100, verbose_name="Тип формы")
    condition = models.CharField(
        max_length=50, default="Новая", verbose_name="Состояние"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    size = models.CharField(max_length=50, verbose_name="Размер")
    color = models.CharField(max_length=50, verbose_name="Цвет")
    features = models.TextField(blank=True, null=True, verbose_name="Особенности")
    contacts = models.CharField(max_length=255, verbose_name="Контакты")
    hashtags = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Хештеги"
    )
    post_url = models.URLField(blank=True, null=True, verbose_name="Ссылка на пост")
    is_available = models.BooleanField(
        default=True, verbose_name="Доступен для покупки"
    )
    stock_quantity = models.IntegerField(default=1, verbose_name="Количество на складе")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def __str__(self):
        return f"{self.team} ({self.season})"

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"


class Image(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images_set",
        verbose_name="Продукт",
    )
    image = models.ImageField(upload_to="products/", verbose_name="Картинка")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    def __str__(self):
        return f"Image for {self.product.team} ({self.product.season})"

    class Meta:
        verbose_name = "Изображение"
        verbose_name_plural = "Изображения"


class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart_items",
        verbose_name="Пользователь",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="cart_items",
        verbose_name="Товар",
    )
    quantity = models.IntegerField(default=1, verbose_name="Количество")
    selected_size = models.CharField(max_length=10, verbose_name="Выбранный размер")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def __str__(self):
        return f"{self.quantity}x {self.product.team} ({self.selected_size})"

    class Meta:
        verbose_name = "Элемент корзины"
        verbose_name_plural = "Элементы корзины"
        unique_together = ("user", "product", "selected_size")


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorites",
        verbose_name="Пользователь",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="favorites",
        verbose_name="Товар",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    def __str__(self):
        return f"{self.product.team} в избранном у {self.user}"

    class Meta:
        verbose_name = "Избранный товар"
        verbose_name_plural = "Избранные товары"
        unique_together = ("user", "product")
