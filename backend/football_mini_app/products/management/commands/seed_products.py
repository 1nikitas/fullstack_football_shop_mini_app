from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = "Заполнить базу данных тестовыми товарами"

    def handle(self, *args, **options):
        products_data = [
            {
                "team": "Реал Мадрид",
                "national_team": None,
                "brand": "Adidas",
                "season": "2023/24",
                "kit_type": "Домашняя форма",
                "condition": "Новая",
                "price": 89.99,
                "size": "M",
                "color": "Белый",
                "features": "Официальная форма команды, 100% полиэстер",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#реалмадрид #adidas #форма",
                "post_url": "https://t.me/football_store/123",
                "is_available": True,
                "stock_quantity": 5,
            },
            {
                "team": "Барселона",
                "national_team": None,
                "brand": "Nike",
                "season": "2023/24",
                "kit_type": "Гостевая форма",
                "condition": "Новая",
                "price": 94.99,
                "size": "L",
                "color": "Синий",
                "features": "Легкая и дышащая ткань, технология Dri-FIT",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#барселона #nike #форма",
                "post_url": "https://t.me/football_store/124",
                "is_available": True,
                "stock_quantity": 3,
            },
            {
                "team": "Манчестер Юнайтед",
                "national_team": None,
                "brand": "Adidas",
                "season": "2023/24",
                "kit_type": "Домашняя форма",
                "condition": "Новая",
                "price": 79.99,
                "size": "S",
                "color": "Красный",
                "features": "Классический дизайн, комфортная посадка",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#манчестерюнайтед #adidas #форма",
                "post_url": "https://t.me/football_store/125",
                "is_available": True,
                "stock_quantity": 7,
            },
            {
                "team": "Ливерпуль",
                "national_team": None,
                "brand": "Nike",
                "season": "2023/24",
                "kit_type": "Домашняя форма",
                "condition": "Новая",
                "price": 84.99,
                "size": "XL",
                "color": "Красный",
                "features": "Современный дизайн, влагоотводящая ткань",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#ливерпуль #nike #форма",
                "post_url": "https://t.me/football_store/126",
                "is_available": True,
                "stock_quantity": 4,
            },
            {
                "team": "Челси",
                "national_team": None,
                "brand": "Nike",
                "season": "2023/24",
                "kit_type": "Гостевая форма",
                "condition": "Новая",
                "price": 89.99,
                "size": "M",
                "color": "Белый",
                "features": "Элегантный дизайн, премиальные материалы",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#челси #nike #форма",
                "post_url": "https://t.me/football_store/127",
                "is_available": True,
                "stock_quantity": 2,
            },
            {
                "team": "Арсенал",
                "national_team": None,
                "brand": "Adidas",
                "season": "2023/24",
                "kit_type": "Домашняя форма",
                "condition": "Новая",
                "price": 74.99,
                "size": "L",
                "color": "Красный",
                "features": "Классический стиль, отличное качество",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#арсенал #adidas #форма",
                "post_url": "https://t.me/football_store/128",
                "is_available": True,
                "stock_quantity": 6,
            },
            {
                "team": "Бразилия",
                "national_team": "Бразилия",
                "brand": "Nike",
                "season": "2022",
                "kit_type": "Домашняя форма",
                "condition": "Новая",
                "price": 99.99,
                "size": "M",
                "color": "Желтый",
                "features": "Официальная форма сборной Бразилии",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#бразилия #nike #сборная",
                "post_url": "https://t.me/football_store/129",
                "is_available": True,
                "stock_quantity": 3,
            },
            {
                "team": "Аргентина",
                "national_team": "Аргентина",
                "brand": "Adidas",
                "season": "2022",
                "kit_type": "Домашняя форма",
                "condition": "Новая",
                "price": 104.99,
                "size": "L",
                "color": "Голубой",
                "features": "Официальная форма сборной Аргентины",
                "contacts": "+7 (999) 123-45-67",
                "hashtags": "#аргентина #adidas #сборная",
                "post_url": "https://t.me/football_store/130",
                "is_available": True,
                "stock_quantity": 4,
            },
        ]

        created_count = 0
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                team=product_data["team"],
                season=product_data["season"],
                kit_type=product_data["kit_type"],
                defaults=product_data,
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Создан товар: {product.team} ({product.season})"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(f"Успешно создано {created_count} новых товаров")
        )
