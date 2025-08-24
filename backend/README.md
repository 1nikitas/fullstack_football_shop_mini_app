# Football Mini App - Backend

Django бэкенд для мини-приложения продажи футбольной атрибутики.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
# Из корневой папки проекта
make install-backend

# Или напрямую
cd backend/football_mini_app
poetry install --no-root
```

### 2. Активация виртуального окружения
```bash
cd backend/football_mini_app
poetry shell
```

### 3. Применение миграций
```bash
poetry run python manage.py migrate
```

### 4. Создание суперпользователя
```bash
poetry run python manage.py createsuperuser
```

### 5. Запуск сервера разработки
```bash
# Локально
poetry run python manage.py runserver 0.0.0.0:8000 --settings=football_mini_app.settings_local

# С доменом rooneyform.ru
poetry run python manage.py runserver 0.0.0.0:8000 --settings=football_mini_app.settings_prod
```

## 📁 Структура проекта

```
backend/football_mini_app/
├── football_mini_app/          # Основное Django приложение
│   ├── __init__.py
│   ├── settings.py             # Базовые настройки
│   ├── settings_local.py       # Локальные настройки (создается автоматически)
│   ├── settings_prod.py        # Продакшн настройки (создается автоматически)
│   ├── urls.py                 # Основные URL
│   ├── wsgi.py                 # WSGI конфигурация
│   └── asgi.py                 # ASGI конфигурация
├── users/                       # Приложение пользователей
├── products/                    # Приложение продуктов
├── orders/                      # Приложение заказов
├── manage.py                    # Django management
├── pyproject.toml              # Poetry конфигурация
└── poetry.lock                 # Lock файл зависимостей
```

## 🛠️ Управление зависимостями

### Добавление новой зависимости
```bash
cd backend/football_mini_app
poetry add package-name
```

### Добавление dev-зависимости
```bash
cd backend/football_mini_app
poetry add --group dev package-name
```

### Обновление зависимостей
```bash
cd backend/football_mini_app
poetry update
```

### Удаление зависимости
```bash
cd backend/football_mini_app
poetry remove package-name
```

## 🔧 Настройки

### Локальная разработка (settings_local.py)
- `DEBUG = True`
- `ALLOWED_HOSTS = ["localhost", "127.0.0.1"]`
- `CORS_ALLOW_ALL_ORIGINS = True`

### Продакшн (settings_prod.py)
- `DEBUG = False`
- `ALLOWED_HOSTS = ["rooneyform.ru", "www.rooneyform.ru", "localhost", "127.0.0.1"]`
- `CORS_ALLOWED_ORIGINS` настроен для домена rooneyform.ru

## 🧪 Тестирование

### Запуск тестов
```bash
cd backend/football_mini_app
poetry run python manage.py test
```

### Запуск с покрытием
```bash
cd backend/football_mini_app
poetry run pytest --cov=.
```

## 📝 Линтинг и форматирование

### Проверка кода
```bash
cd backend/football_mini_app
poetry run black --check .
poetry run isort --check .
poetry run flake8 .
```

### Форматирование кода
```bash
cd backend/football_mini_app
poetry run black .
poetry run isort .
```

## 🗄️ База данных

### SQLite (по умолчанию)
База данных находится в `db_football_mini_app.sqlite3`

### Миграции
```bash
# Создание миграций
poetry run python manage.py makemigrations

# Применение миграций
poetry run python manage.py migrate

# Просмотр статуса миграций
poetry run python manage.py showmigrations
```

## 🌐 API Endpoints

### Пользователи
- `POST /api/users/register_telegram/` - Регистрация пользователя Telegram

### Продукты
- `GET /api/products/` - Список продуктов
- `GET /api/products/{id}/` - Детали продукта
- `GET /api/products/filter_options/` - Опции фильтров

### Корзина
- `GET /api/cart/by_telegram_id/` - Корзина пользователя
- `POST /api/cart/` - Добавление в корзину
- `PATCH /api/cart/{id}/` - Обновление корзины
- `DELETE /api/cart/{id}/` - Удаление из корзины

### Избранное
- `GET /api/favorites/by_telegram_id/` - Избранное пользователя
- `POST /api/favorites/` - Добавление в избранное
- `DELETE /api/favorites/{id}/` - Удаление из избранного

### Заказы
- `POST /api/orders/create_from_cart/` - Создание заказа
- `GET /api/orders/` - Список заказов пользователя
- `GET /api/orders/stats/` - Статистика заказов

## 🔒 Безопасность

### CORS
Настроен для работы с фронтендом на localhost:3000 и доменом rooneyform.ru

### CSRF
Включена защита от CSRF атак

### XSS Protection
Включена защита от XSS атак в продакшне

## 📊 Мониторинг

### Логи
Django логи выводятся в консоль в режиме разработки

### Статические файлы
Сбор статических файлов: `poetry run python manage.py collectstatic`

## 🚀 Деплой

### Подготовка к продакшну
```bash
# Из корневой папки
make setup-prod
make collectstatic
```

### Запуск продакшн сервера
```bash
# Из корневой папки
make run-prod

# Или напрямую
cd backend/football_mini_app
poetry run python manage.py runserver 0.0.0.0:8000 --settings=football_mini_app.settings_prod
```

## 📚 Полезные ссылки

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Poetry Documentation](https://python-poetry.org/docs/)
- [CORS Headers](https://github.com/adamchainz/django-cors-headers)
