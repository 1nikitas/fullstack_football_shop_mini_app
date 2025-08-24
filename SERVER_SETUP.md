# 🚀 Настройка сервера для домена rooneyform.ru

## 📋 Требования

- Ubuntu/Debian сервер с root доступом
- Домен rooneyform.ru, указывающий на IP сервера
- Открытые порты 80, 443, 8000, 3000

## 🔧 Пошаговая настройка

### 1. Подключение к серверу

```bash
ssh root@45.153.191.250
```

### 2. Клонирование проекта

```bash
cd ~
git clone <your-repo-url> fullstack_football_shop_mini_app
cd fullstack_football_shop_mini_app
```

### 3. Установка зависимостей

```bash
# Установка всех зависимостей
make install

# Или по отдельности
make install-backend
make install-frontend
```

### 4. Настройка домена

```bash
# Настройка hosts файла
make setup-hosts

# Настройка SSL сертификатов
make ssl-setup
```

### 5. Настройка Nginx

```bash
# Настройка Nginx для проксирования портов
make setup-nginx
```

### 6. Запуск приложения

```bash
# Запуск с доменом rooneyform.ru
make run-prod
```

## 🌐 Доступ к приложению

После настройки Nginx:

- **Фронтенд**: https://rooneyform.ru
- **Бэкенд API**: https://rooneyform.ru/api/
- **Django Admin**: https://rooneyform.ru/admin/
- **Статические файлы**: https://rooneyform.ru/static/
- **Медиа файлы**: https://rooneyform.ru/media/

## 🔍 Проверка работы

### Проверка Nginx
```bash
systemctl status nginx
nginx -t
```

### Проверка портов
```bash
netstat -tlnp | grep -E ':(80|443|8000|3000)'
```

### Проверка приложения
```bash
# Фронтенд
curl -k https://rooneyform.ru

# Бэкенд
curl -k https://rooneyform.ru/api/products/
```

## 🚨 Решение проблем

### Проблема: "Connection refused" на порту 80/443

**Решение**: Настройте Nginx
```bash
make setup-nginx
```

### Проблема: SSL сертификат не работает

**Решение**: Пересоздайте сертификаты
```bash
make clean
make ssl-setup
```

### Проблема: Порты заняты

**Решение**: Остановите и перезапустите
```bash
make force-stop
make run-prod
```

### Проблема: Nginx не запускается

**Решение**: Проверьте конфигурацию
```bash
nginx -t
systemctl status nginx
journalctl -u nginx -f
```

## 📁 Структура файлов на сервере

```
/root/fullstack_football_shop_mini_app/
├── nginx/
│   └── rooneyform.ru.conf          # Конфигурация Nginx
├── ssl_certs/
│   ├── rooneyform.ru.crt           # SSL сертификат
│   └── rooneyform.ru.key           # SSL ключ
├── backend/                         # Django бэкенд
├── front/                           # React фронтенд
├── scripts/
│   ├── setup_nginx.sh              # Скрипт настройки Nginx
│   ├── setup_hosts.sh              # Скрипт настройки hosts
│   └── check_domain.sh             # Скрипт проверки домена
└── Makefile                        # Управление проектом
```

## 🔒 Безопасность

### Firewall
```bash
# Открыть только необходимые порты
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### SSL сертификаты
- Самоподписанные сертификаты для разработки
- Для продакшна используйте Let's Encrypt

### Django настройки
- `DEBUG = False` в продакшне
- Настроенные `ALLOWED_HOSTS`
- CORS настройки для домена

## 📊 Мониторинг

### Логи Nginx
```bash
tail -f /var/log/nginx/rooneyform.ru.access.log
tail -f /var/log/nginx/rooneyform.ru.error.log
```

### Логи Django
```bash
# В терминале где запущен Django
tail -f django.log
```

### Статус сервисов
```bash
systemctl status nginx
systemctl status <your-app-service>
```

## 🔄 Обновление

### Обновление кода
```bash
cd ~/fullstack_football_shop_mini_app
git pull origin main
make install
make run-prod
```

### Обновление Nginx
```bash
make setup-nginx
```

### Обновление SSL
```bash
make clean
make ssl-setup
```

## 📞 Поддержка

При возникновении проблем:

1. **Проверьте логи**: `journalctl -u nginx -f`
2. **Проверьте статус**: `systemctl status nginx`
3. **Проверьте порты**: `netstat -tlnp`
4. **Используйте диагностику**: `make check-domain`, `make check-ports`
5. **См. документацию**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🎯 Результат

После выполнения всех шагов:
- ✅ Домен rooneyform.ru доступен на портах 80/443
- ✅ Фронтенд работает на https://rooneyform.ru
- ✅ Бэкенд API доступен на https://rooneyform.ru/api/
- ✅ SSL сертификаты настроены
- ✅ Nginx проксирует запросы на правильные порты
