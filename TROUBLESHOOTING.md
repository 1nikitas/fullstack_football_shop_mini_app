# 🔧 Troubleshooting - Решение проблем

## 🚨 Частые проблемы и их решения

### 1. **Node.js версия слишком старая**

**Ошибка:**
```
You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+.
```

**Решение:**
```bash
# Проверьте версию Node.js
node --version

# Если версия < 20, обновите Node.js
# macOS (через Homebrew)
brew install node

# Или скачайте с официального сайта
# https://nodejs.org/
```

### 2. **Порты уже заняты**

**Ошибка:**
```
Error: That port is already in use.
```

**Решение:**
```bash
# Остановите все сервисы
make stop

# Принудительная остановка
make force-stop

# Проверьте порты
make check-ports

# Запустите с альтернативными портами
DJANGO_PORT=8001 REACT_PORT=3001 make run
```

### 8. **Домен недоступен на порту 80/443**

**Ошибка:**
```
ERR_CONNECTION_REFUSED
Сайт rooneyform.ru не позволяет установить соединение
```

**Причина:** Приложение запущено на портах 8000/3000, а браузер пытается подключиться к портам 80/443

**Решение:**
```bash
# Настройте Nginx для проксирования портов
make setup-nginx

# Или используйте правильные порты
http://rooneyform.ru:3000/  # Фронтенд
http://rooneyform.ru:8000/  # Бэкенд
```

### 3. **Ошибка crypto.hash в Vite**

**Ошибка:**
```
TypeError: crypto.hash is not a function
```

**Причина:** Несовместимость версий Node.js и Vite

**Решение:**
```bash
# Обновите Node.js до версии 20+
# Очистите node_modules и переустановите
cd front
rm -rf node_modules package-lock.json
npm install
```

### 4. **Poetry не может установить проект**

**Ошибка:**
```
Error: The current project could not be installed: No file/folder found for package football-mini-app
```

**Решение:**
```bash
# Используйте --no-root флаг
cd backend/football_mini_app
poetry install --no-root

# Или используйте Makefile
make install-backend
```

### 5. **Django не может запуститься**

**Ошибка:**
```
SystemCheckError: System check identified some issues
```

**Решение:**
```bash
# Проверьте настройки Django
cd backend/football_mini_app
poetry run python manage.py check --settings=football_mini_app.settings_local

# Примените миграции
poetry run python manage.py migrate

# Создайте суперпользователя
poetry run python manage.py createsuperuser
```

### 6. **CORS ошибки**

**Ошибка:**
```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Решение:**
```bash
# Проверьте настройки CORS в Django
# Убедитесь, что django-cors-headers установлен
cd backend/football_mini_app
poetry add django-cors-headers

# Проверьте настройки в settings_local.py и settings_prod.py
```

### 7. **SSL сертификаты не работают**

**Ошибка:**
```
SSL certificate verification failed
```

**Решение:**
```bash
# Пересоздайте SSL сертификаты
make clean
make ssl-setup

# Добавьте сертификат в доверенные в вашей ОС
# macOS: дважды кликните на .crt файл и добавьте в Keychain
```

## 🛠️ Команды диагностики

### Проверка окружения
```bash
make check-env
```

### Проверка портов
```bash
make check-ports
```

### Проверка домена
```bash
make check-domain
```

### Проверка Django
```bash
cd backend/football_mini_app
poetry run python manage.py check --settings=football_mini_app.settings_local
```

### Проверка зависимостей
```bash
# Backend
cd backend/football_mini_app
poetry show

# Frontend
cd front
npm list
```

## 🔄 Последовательность решения проблем

### 1. Остановите все сервисы
```bash
make force-stop
```

### 2. Проверьте окружение
```bash
make check-env
```

### 3. Проверьте порты
```bash
make check-ports
```

### 4. Очистите временные файлы
```bash
make clean
```

### 5. Переустановите зависимости
```bash
make install
```

### 6. Запустите заново
```bash
make run
```

## 📱 Альтернативные порты

Если стандартные порты заняты, используйте:

```bash
# Django на порту 8001, React на порту 3001
DJANGO_PORT=8001 REACT_PORT=3001 make run

# Django на порту 8002, React на порту 3002
DJANGO_PORT=8002 REACT_PORT=3002 make run
```

## 🌐 Проблемы с доменом

### Hosts файл не настроен
```bash
make setup-hosts
```

### SSL сертификаты не работают
```bash
make ssl-setup
```

### Проверка настроек домена
```bash
make check-domain
```

## 📞 Получение помощи

1. **Проверьте логи:**
   - Django: в терминале где запущен бэкенд
   - React: в терминале где запущен фронтенд
   - Браузер: Developer Tools → Console

2. **Используйте команды диагностики:**
   ```bash
   make check-env
   make check-ports
   make check-domain
   ```

3. **Проверьте документацию:**
   - [README.md](README.md)
   - [QUICKSTART.md](QUICKSTART.md)
   - [backend/README.md](backend/README.md)

4. **Очистите и переустановите:**
   ```bash
   make clean
   make install
   ```
