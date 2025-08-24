# 🚀 Быстрый старт Football Mini App

## ⚡ Быстрый запуск

### 1. Установка зависимостей
```bash
make install
```

### 2. Запуск на localhost (для разработки)
```bash
make run
```
- Бэкенд: http://localhost:8000
- Фронтенд: http://localhost:3000

### 3. Запуск с доменом rooneyform.ru
```bash
make run-prod
```
- Бэкенд: https://rooneyform.ru:8000
- Фронтенд: https://rooneyform.ru:3000

## 🛠️ Основные команды

```bash
make help          # Показать все команды
make run           # Запуск на localhost
make run-prod      # Запуск с доменом
make stop          # Остановка всех сервисов
make clean         # Очистка временных файлов
make check-domain  # Проверка доступности домена
```

## 🔧 Настройка домена

При первом запуске `make run-prod`:
1. Автоматически создаются SSL сертификаты
2. Настраивается hosts файл
3. Создаются продакшн настройки Django

## 📁 Структура проекта

```
football-mini-app/
├── backend/                 # Django бэкенд
├── front/                   # React фронтенд
├── scripts/                 # Утилиты и скрипты
├── Makefile                # Управление проектом
└── README.md               # Подробная документация
```

## 🚨 Важно

- Для продакшна замените самоподписанные SSL сертификаты на настоящие
- Измените `SECRET_KEY` в настройках Django
- Настройте `ALLOWED_HOSTS` для вашего домена

## 📖 Подробная документация

См. [README.md](README.md) для полного описания всех возможностей.
