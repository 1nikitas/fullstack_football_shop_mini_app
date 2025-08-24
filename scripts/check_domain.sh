#!/bin/bash

# Скрипт для проверки доступности домена и портов

DOMAIN="rooneyform.ru"
DJANGO_PORT=8000
REACT_PORT=3000

echo "Проверка доступности домена $DOMAIN..."

# Проверяем DNS резолвинг
echo "1. Проверка DNS резолвинга..."
if nslookup $DOMAIN > /dev/null 2>&1; then
    echo "✅ DNS резолвинг работает"
    nslookup $DOMAIN | grep "Address:"
else
    echo "❌ DNS резолвинг не работает"
fi

echo ""

# Проверяем доступность по HTTP
echo "2. Проверка доступности Django (порт $DJANGO_PORT)..."
if curl -s --connect-timeout 5 "http://$DOMAIN:$DJANGO_PORT" > /dev/null 2>&1; then
    echo "✅ Django доступен на http://$DOMAIN:$DJANGO_PORT"
else
    echo "❌ Django недоступен на http://$DOMAIN:$DJANGO_PORT"
fi

# Проверяем доступность по HTTPS
echo "3. Проверка доступности Django (порт $DJANGO_PORT, HTTPS)..."
if curl -s -k --connect-timeout 5 "https://$DOMAIN:$DJANGO_PORT" > /dev/null 2>&1; then
    echo "✅ Django доступен на https://$DOMAIN:$DJANGO_PORT"
else
    echo "❌ Django недоступен на https://$DOMAIN:$DJANGO_PORT"
fi

echo ""

# Проверяем доступность React
echo "4. Проверка доступности React (порт $REACT_PORT)..."
if curl -s --connect-timeout 5 "http://$DOMAIN:$REACT_PORT" > /dev/null 2>&1; then
    echo "✅ React доступен на http://$DOMAIN:$REACT_PORT"
else
    echo "❌ React недоступен на http://$DOMAIN:$REACT_PORT"
fi

# Проверяем доступность React по HTTPS
echo "5. Проверка доступности React (порт $REACT_PORT, HTTPS)..."
if curl -s -k --connect-timeout 5 "https://$DOMAIN:$REACT_PORT" > /dev/null 2>&1; then
    echo "✅ React доступен на https://$DOMAIN:$REACT_PORT"
else
    echo "❌ React недоступен на https://$DOMAIN:$REACT_PORT"
fi

echo ""

# Проверяем SSL сертификаты
echo "6. Проверка SSL сертификатов..."
if [ -f "ssl_certs/$DOMAIN.crt" ]; then
    echo "✅ SSL сертификат найден: ssl_certs/$DOMAIN.crt"
    openssl x509 -in "ssl_certs/$DOMAIN.crt" -text -noout | grep -E "(Subject:|Not Before:|Not After:)"
else
    echo "❌ SSL сертификат не найден"
fi

echo ""

# Проверяем hosts файл
echo "7. Проверка hosts файла..."
if grep -q "$DOMAIN" /etc/hosts; then
    echo "✅ Домен $DOMAIN найден в /etc/hosts:"
    grep "$DOMAIN" /etc/hosts
else
    echo "❌ Домен $DOMAIN не найден в /etc/hosts"
    echo "Выполните: make setup-hosts"
fi

echo ""
echo "Для запуска приложения используйте:"
echo "  make run-prod    # Запуск с доменом $DOMAIN"
echo "  make run         # Запуск на localhost"
