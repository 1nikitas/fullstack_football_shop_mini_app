#!/bin/bash

# Скрипт для настройки Nginx на сервере

echo "Настройка Nginx для домена rooneyform.ru..."

# Проверяем, установлен ли Nginx
if ! command -v nginx &> /dev/null; then
    echo "Nginx не установлен. Устанавливаем..."
    apt update
    apt install -y nginx
fi

# Создаем директорию для конфигурации
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Копируем конфигурацию
if [ -f "nginx/rooneyform.ru.conf" ]; then
    cp nginx/rooneyform.ru.conf /etc/nginx/sites-available/rooneyform.ru
    echo "Конфигурация Nginx скопирована"
else
    echo "Ошибка: файл nginx/rooneyform.ru.conf не найден"
    exit 1
fi

# Создаем символическую ссылку
if [ -L "/etc/nginx/sites-enabled/rooneyform.ru" ]; then
    rm /etc/nginx/sites-enabled/rooneyform.ru
fi
ln -s /etc/nginx/sites-available/rooneyform.ru /etc/nginx/sites-enabled/

# Удаляем дефолтную конфигурацию
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Проверяем конфигурацию Nginx
echo "Проверка конфигурации Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Конфигурация корректна. Перезапускаем Nginx..."
    systemctl reload nginx
    
    # Проверяем статус
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx успешно настроен и запущен"
        echo "🌐 Теперь доступно:"
        echo "   - https://rooneyform.ru (фронтенд)"
        echo "   - https://rooneyform.ru/api/ (бэкенд)"
        echo "   - https://rooneyform.ru/admin/ (Django admin)"
    else
        echo "❌ Ошибка запуска Nginx"
        systemctl status nginx
    fi
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi

# Настройка firewall (если используется ufw)
if command -v ufw &> /dev/null; then
    echo "Настройка firewall..."
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "Порты 80 и 443 открыты в firewall"
fi

echo ""
echo "Настройка завершена!"
echo "Для проверки используйте:"
echo "  curl -k https://rooneyform.ru"
echo "  curl -k https://rooneyform.ru/api/products/"
