# Руководство по развертыванию Football Mini App

## 🚀 Быстрый старт

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y python3 python3-pip python3-venv nginx postgresql postgresql-contrib

# Установка Poetry
curl -sSL https://install.python-poetry.org | python3 -
```

### 2. Настройка базы данных

```bash
# Создание пользователя базы данных
sudo -u postgres createuser --interactive
# Введите имя пользователя: football_app
# Введите пароль: ваш_пароль

# Создание базы данных
sudo -u postgres createdb football_mini_app

# Подключение к базе данных
sudo -u postgres psql
```

```sql
-- В PostgreSQL
ALTER USER football_app WITH PASSWORD 'ваш_пароль';
GRANT ALL PRIVILEGES ON DATABASE football_mini_app TO football_app;
\q
```

### 3. Развертывание бэкенда

```bash
# Клонирование репозитория
git clone https://github.com/your-username/football-mini-app.git
cd football-mini-app/backend

# Установка зависимостей
poetry install

# Активация виртуального окружения
poetry shell

# Переход в папку Django проекта
cd football_mini_app

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл

# Применение миграций
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Сбор статических файлов
python manage.py collectstatic

# Тестирование сервера
python manage.py runserver 0.0.0.0:8000
```

### 4. Настройка Gunicorn

```bash
# Установка Gunicorn
poetry add gunicorn

# Создание systemd сервиса
sudo nano /etc/systemd/system/football-app.service
```

```ini
[Unit]
Description=Football Mini App Django
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/football-mini-app/backend/football_mini_app
Environment="PATH=/path/to/football-mini-app/backend/.venv/bin"
ExecStart=/path/to/football-mini-app/backend/.venv/bin/gunicorn --workers 3 --bind unix:/run/football-app.sock football_mini_app.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Активация сервиса
sudo systemctl daemon-reload
sudo systemctl start football-app
sudo systemctl enable football-app
```

### 5. Настройка Nginx

```bash
# Создание конфигурации сайта
sudo nano /etc/nginx/sites-available/football-app
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://unix:/run/football-app.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/football-mini-app/backend/football_mini_app/static/;
    }

    location /media/ {
        alias /path/to/football-mini-app/backend/football_mini_app/media/;
    }
}
```

```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/football-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Настройка SSL (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Настройка Django

### 1. Production настройки

Создайте файл `settings_prod.py`:

```python
from .settings import *

DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'www.your-domain.com']

# База данных PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'football_mini_app',
        'USER': 'football_app',
        'PASSWORD': 'ваш_пароль',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Статические файлы
STATIC_ROOT = BASE_DIR / 'static'
MEDIA_ROOT = BASE_DIR / 'media'

# Безопасность
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# CORS настройки
CORS_ALLOWED_ORIGINS = [
    "https://your-domain.com",
    "https://www.your-domain.com",
]
```

### 2. Переменные окружения

Создайте файл `.env`:

```env
SECRET_KEY=ваш_секретный_ключ
DEBUG=False
DATABASE_URL=postgresql://football_app:пароль@localhost/football_mini_app
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
```

## 🚀 Развертывание фронтенда

### 1. Сборка для продакшна

```bash
cd front
npm install
npm run build
```

### 2. Развертывание на Vercel

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Развертывание
vercel --prod
```

### 3. Развертывание на Netlify

```bash
# Сборка
npm run build

# Загрузка папки dist в Netlify
# Или используйте Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔐 Настройка Telegram Bot

### 1. Создание бота

1. Найдите @BotFather в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям
4. Сохраните токен бота

### 2. Настройка WebApp

```python
# В Django настройках
TELEGRAM_BOT_TOKEN = 'ваш_токен_бота'
TELEGRAM_WEBAPP_URL = 'https://your-domain.com'
```

### 3. Настройка команд бота

```python
# Создайте команды для бота
BOT_COMMANDS = [
    ('start', 'Запустить приложение'),
    ('catalog', 'Каталог товаров'),
    ('cart', 'Корзина'),
    ('favorites', 'Избранное'),
]
```

## 📊 Мониторинг и логи

### 1. Логи Django

```bash
# Просмотр логов
sudo journalctl -u football-app -f

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Мониторинг системы

```bash
# Установка htop
sudo apt install htop

# Мониторинг ресурсов
htop
```

## 🔄 Обновление приложения

### 1. Автоматическое обновление

Создайте скрипт `update.sh`:

```bash
#!/bin/bash
cd /path/to/football-mini-app
git pull origin main

# Обновление бэкенда
cd backend
poetry install
cd football_mini_app
python manage.py migrate
python manage.py collectstatic

# Перезапуск сервисов
sudo systemctl restart football-app
sudo systemctl reload nginx
```

### 2. Настройка cron для автоматических обновлений

```bash
sudo crontab -e
# Добавьте строку для ежедневного обновления:
# 0 2 * * * /path/to/football-mini-app/update.sh
```

## 🚨 Безопасность

### 1. Firewall

```bash
# Настройка UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Регулярные обновления

```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Резервное копирование

```bash
# Создание скрипта резервного копирования
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Резервное копирование базы данных
pg_dump football_mini_app > $BACKUP_DIR/db_$DATE.sql

# Резервное копирование медиа файлов
tar -czf $BACKUP_DIR/media_$DATE.tar.gz media/

# Удаление старых резервных копий (старше 30 дней)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

## 📱 Тестирование

### 1. Проверка API

```bash
# Тест API endpoints
curl https://your-domain.com/api/products/
curl https://your-domain.com/api/cart/by_telegram_id/?telegram_id=123
```

### 2. Проверка WebApp в Telegram

1. Откройте бота в Telegram
2. Отправьте команду `/start`
3. Проверьте работу всех функций

### 3. Нагрузочное тестирование

```bash
# Установка Apache Bench
sudo apt install apache2-utils

# Тест производительности
ab -n 1000 -c 10 https://your-domain.com/api/products/
```

## 🔧 Troubleshooting

### Проблемы с базой данных

```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Перезапуск PostgreSQL
sudo systemctl restart postgresql
```

### Проблемы с Nginx

```bash
# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

### Проблемы с Django

```bash
# Проверка логов
sudo journalctl -u football-app -n 50

# Перезапуск Django
sudo systemctl restart football-app
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи сервисов
2. Убедитесь, что все зависимости установлены
3. Проверьте настройки файрвола
4. Создайте Issue в репозитории проекта
