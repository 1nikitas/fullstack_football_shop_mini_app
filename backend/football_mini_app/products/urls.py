from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ImageViewSet, CartItemViewSet, FavoriteViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"images", ImageViewSet)
router.register(r"cart", CartItemViewSet, basename="cart")
router.register(r"favorites", FavoriteViewSet, basename="favorites")

urlpatterns = [
    path("", include(router.urls)),
]
