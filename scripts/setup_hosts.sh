#!/bin/bash

# Скрипт для настройки hosts файла для локального тестирования домена rooneyform.ru

DOMAIN="rooneyform.ru"
LOCAL_IP="127.0.0.1"
HOSTS_FILE="/etc/hosts"

echo "Настройка hosts файла для домена $DOMAIN..."

# Проверяем, есть ли уже запись в hosts файле
if grep -q "$DOMAIN" "$HOSTS_FILE"; then
    echo "Домен $DOMAIN уже настроен в hosts файле"
    grep "$DOMAIN" "$HOSTS_FILE"
else
    echo "Добавление записи в hosts файл..."
    
    # Создаем резервную копию
    sudo cp "$HOSTS_FILE" "${HOSTS_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Добавляем запись
    echo "$LOCAL_IP $DOMAIN" | sudo tee -a "$HOSTS_FILE"
    echo "$LOCAL_IP www.$DOMAIN" | sudo tee -a "$HOSTS_FILE"
    
    echo "Домен $DOMAIN успешно добавлен в hosts файл"
    echo "Теперь вы можете использовать $DOMAIN для локального тестирования"
fi

echo ""
echo "Текущие записи для домена $DOMAIN:"
grep "$DOMAIN" "$HOSTS_FILE" || echo "Записи не найдены"

echo ""
echo "Для удаления записи выполните:"
echo "sudo sed -i '' '/$DOMAIN/d' $HOSTS_FILE"
