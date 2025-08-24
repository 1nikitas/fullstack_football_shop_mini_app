# Football Mini App

Мини-приложение для продажи футбольной атрибутики с интеграцией Telegram.

## Структура проекта

```
football-mini-app/
├── backend/                 # Django бэкенд
│   └── football_mini_app/  # Django приложение
├── front/                   # React фронтенд
├── scripts/                 # Скрипты и утилиты
└── Makefile                # Основной файл управления
```

## Требования

- Python 3.8+
- Poetry (для управления зависимостями Python)
- Node.js 16+ и npm
- OpenSSL (для генерации SSL сертификатов)

## Установка

### 1. Установка всех зависимостей
```bash
make install
```

### 2. Установка только бэкенда
```bash
make install-backend
```

### 3. Установка только фронтенда
```bash
make install-frontend
```

## Запуск

### Локальная разработка (localhost)
```bash
make run
```
- Бэкенд: http://localhost:8000
- Фронтенд: http://localhost:3000

### Продакшн с доменом rooneyform.ru
```bash
make run-prod
```
- Бэкенд: https://rooneyform.ru:8000
- Фронтенд: https://rooneyform.ru:3000

## Основные команды

### Управление сервисами
```bash
make run          # Запуск на localhost
make run-prod     # Запуск с доменом rooneyform.ru
make stop         # Остановка всех сервисов
make restart      # Перезапуск на localhost
make restart-prod # Перезапуск с доменом
```

### Django команды
```bash
make migrate          # Применение миграций
make makemigrations  # Создание миграций
make createsuperuser # Создание суперпользователя
make collectstatic   # Сбор статических файлов
```

### Разработка
```bash
make lint            # Проверка кода
make format          # Форматирование кода
make test            # Запуск тестов
make shell           # Shell в Poetry окружении
```

### Управление зависимостями
```bash
make add-dependency pkg=package-name        # Добавить зависимость
make add-dev-dependency pkg=package-name    # Добавить dev-зависимость
```

## Настройка домена

### 1. SSL сертификаты
При первом запуске `make run-prod` автоматически создаются самоподписанные SSL сертификаты для домена rooneyform.ru.

### 2. Настройки Django
- **Локальные**: `settings_local.py` - для разработки
- **Продакшн**: `settings_prod.py` - для домена rooneyform.ru

### 3. Настройки React
- Автоматическое определение окружения
- API URL настраивается автоматически

## Docker

### Создание Docker окружения
```bash
make docker-setup
```

### Запуск через Docker
```bash
docker-compose up
```

## Очистка

### Очистка временных файлов
```bash
make clean
```

## Полезные алиасы

```bash
make up        # make run
make up-prod   # make run-prod
make down      # make stop
```

## Troubleshooting

### Проблемы с портами
Если порты 8000 или 3000 заняты, измените переменные в Makefile:
```makefile
DJANGO_PORT = 8001
REACT_PORT = 3001
```

### Проблемы с SSL
```bash
make clean    # Удалить старые сертификаты
make run-prod # Создать новые
```

### Проблемы с CORS
Проверьте настройки в `settings_prod.py` и убедитесь, что домен правильно указан в `CORS_ALLOWED_ORIGINS`.

## Структура настроек

### Django
- `settings.py` - базовые настройки
- `settings_local.py` - для разработки (создается автоматически)
- `settings_prod.py` - для продакшна (создается автоматически)

### React
- `vite.config.js` - конфигурация Vite
- `src/config/environment.ts` - переменные окружения
- `src/services/api.ts` - API сервис с автоматической настройкой URL

## Безопасность

⚠️ **Важно**: 
- Не используйте `make run-prod` в продакшне без настройки настоящих SSL сертификатов
- Измените `SECRET_KEY` в настройках Django
- Настройте `ALLOWED_HOSTS` для вашего домена
- Отключите `DEBUG = False` в продакшне
