from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer, OrderCreateSerializer
from products.models import CartItem, Product
from users.models import User


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]  # Разрешаем доступ для Telegram WebApp

    def get_queryset(self):
        # Получаем telegram_id из query параметров
        telegram_id = self.request.query_params.get("telegram_id")
        if telegram_id:
            try:
                # Преобразуем telegram_id в число
                telegram_id = int(telegram_id)
                user = User.objects.get(telegram_id=telegram_id)
                return Order.objects.filter(user=user)
            except (ValueError, User.DoesNotExist):
                return Order.objects.none()
        return Order.objects.none()

    def get_serializer_class(self):
        if self.action == "create":
            return OrderCreateSerializer
        return OrderSerializer

    @action(detail=False, methods=["post"])
    def create_from_cart(self, request):
        """Создать заказ из корзины"""
        telegram_id = request.data.get("telegram_id")
        shipping_address = request.data.get("shipping_address")
        phone_number = request.data.get("phone_number")
        notes = request.data.get("notes", "")

        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not shipping_address or not phone_number:
            return Response(
                {"error": "shipping_address и phone_number обязательны"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Получаем пользователя по telegram_id
        try:
            # Преобразуем telegram_id в число
            telegram_id = int(telegram_id)
            user = User.objects.get(telegram_id=telegram_id)
        except (ValueError, User.DoesNotExist):
            return Response(
                {"error": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Получаем товары из корзины
        cart_items = CartItem.objects.filter(user=user).select_related("product")

        if not cart_items.exists():
            return Response(
                {"error": "Корзина пуста"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Проверяем доступность всех товаров
                total_amount = Decimal("0")
                order_items_data = []

                for cart_item in cart_items:
                    product = cart_item.product

                    # Проверяем, что товар все еще доступен
                    if not product.is_available:
                        raise ValueError(f"Товар '{product.team}' больше недоступен")

                    # Проверяем количество на складе
                    if product.stock_quantity < cart_item.quantity:
                        raise ValueError(
                            f"Недостаточно товара '{product.team}' на складе"
                        )

                    # Рассчитываем стоимость
                    item_total = product.price * cart_item.quantity
                    total_amount += item_total

                    order_items_data.append(
                        {
                            "product": product,
                            "quantity": cart_item.quantity,
                            "price": product.price,
                            "selected_size": cart_item.selected_size,
                        }
                    )

                # Создаем заказ
                order = Order.objects.create(
                    user=user,
                    total_amount=total_amount,
                    shipping_address=shipping_address,
                    phone_number=phone_number,
                    notes=notes,
                )

                # Создаем элементы заказа и обновляем остатки
                for item_data in order_items_data:
                    OrderItem.objects.create(
                        order=order,
                        product=item_data["product"],
                        quantity=item_data["quantity"],
                        price=item_data["price"],
                        selected_size=item_data["selected_size"],
                    )

                    # Уменьшаем количество на складе
                    product = item_data["product"]
                    product.stock_quantity -= item_data["quantity"]

                    # Если товар закончился, делаем его недоступным
                    if product.stock_quantity <= 0:
                        product.is_available = False

                    product.save()

                # Очищаем корзину
                cart_items.delete()

                serializer = OrderSerializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        """Отменить заказ"""
        telegram_id = request.data.get("telegram_id")
        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Преобразуем telegram_id в число
            telegram_id = int(telegram_id)
            user = User.objects.get(telegram_id=telegram_id)
            order = Order.objects.get(id=pk, user=user)

            if order.status != "pending":
                return Response(
                    {"error": "Заказ нельзя отменить"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                # Возвращаем товары на склад
                for item in order.items.all():
                    product = item.product
                    product.stock_quantity += item.quantity

                    # Если товар был недоступен, делаем его снова доступным
                    if not product.is_available and product.stock_quantity > 0:
                        product.is_available = True

                    product.save()

                # Отменяем заказ
                order.status = "cancelled"
                order.save()

                return Response({"message": "Заказ отменен"})

        except Order.DoesNotExist:
            return Response(
                {"error": "Заказ не найден"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Получить статистику заказов пользователя"""
        telegram_id = request.query_params.get("telegram_id")
        if not telegram_id:
            return Response(
                {"error": "telegram_id обязателен"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Преобразуем telegram_id в число
            telegram_id = int(telegram_id)
            user = User.objects.get(telegram_id=telegram_id)
            orders = Order.objects.filter(user=user)
        except (ValueError, User.DoesNotExist):
            return Response(
                {"error": "Пользователь не найден"},
                status=status.HTTP_404_NOT_FOUND,
            )

        total_orders = orders.count()
        total_spent = sum(order.total_amount for order in orders)
        pending_orders = orders.filter(status="pending").count()
        completed_orders = orders.filter(status="delivered").count()

        return Response(
            {
                "total_orders": total_orders,
                "total_spent": float(total_spent),
                "pending_orders": pending_orders,
                "completed_orders": completed_orders,
            }
        )


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.AllowAny]  # Разрешаем доступ для Telegram WebApp

    def get_queryset(self):
        # Получаем telegram_id из query параметров
        telegram_id = self.request.query_params.get("telegram_id")
        if telegram_id:
            try:
                user = User.objects.get(telegram_id=telegram_id)
                return OrderItem.objects.filter(order__user=user)
            except User.DoesNotExist:
                return OrderItem.objects.none()
        return OrderItem.objects.none()
