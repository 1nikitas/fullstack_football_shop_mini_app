# Makefile для Football Mini App с Poetry

# Переменные
BACKEND_DIR = backend/football_mini_app
FRONTEND_DIR = front
SCRIPTS_DIR = scripts
PYTHON = python3
POETRY = poetry
NPM = npm
DOMAIN = rooneyform.ru
LOCAL_DOMAIN = localhost
SSL_DIR = ssl_certs
DJANGO_PORT = 8000
REACT_PORT = 3000

# Цели по умолчанию
.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Доступные команды:"
	@echo "  make install      - Установка всех зависимостей"
	@echo "  make install-backend - Установка зависимостей бэкенда через Poetry"
	@echo "  make install-frontend - Установка зависимостей фронтенда"
	@echo "  make run          - Запуск фронтенда и бэкенда на localhost"
	@echo "  make run-prod     - Запуск с доменом $(DOMAIN)"
	@echo "  make backend      - Запуск только бэкенда на localhost"
	@echo "  make frontend     - Запуск только фронтенда на localhost"
	@echo "  make ssl-setup    - Настройка SSL сертификатов для $(DOMAIN)"
	@echo "  make setup-hosts  - Настройка hosts файла для домена $(DOMAIN)"
	@echo "  make check-domain - Проверка доступности домена $(DOMAIN)"
	@echo "  make stop         - Остановка всех сервисов"
	@echo "  make clean        - Очистка временных файлов"
	@echo "  make lint         - Проверка кода линтерами"
	@echo "  make test         - Запуск тестов"
	@echo "  make help         - Показать эту справку"

.PHONY: install
install: install-backend install-frontend

.PHONY: install-backend
install-backend:
	@echo "Установка зависимостей бэкенда через Poetry..."
	cd $(BACKEND_DIR) && $(POETRY) install --no-root
	@echo "Бэкенд зависимости установлены"

.PHONY: install-frontend
install-frontend:
	@echo "Установка зависимостей фронтенда..."
	cd $(FRONTEND_DIR) && $(NPM) install
	@echo "Фронтенд зависимости установлены"

.PHONY: run
run: setup-local
	@echo "Запуск приложения на localhost..."
	$(MAKE) -j 2 backend-local frontend-local

.PHONY: run-prod
run-prod: ssl-setup setup-prod setup-hosts
	@echo "Запуск приложения с доменом $(DOMAIN)..."
	$(MAKE) -j 2 backend-prod frontend-prod

.PHONY: setup-local
setup-local:
	@echo "Настройка для localhost..."
	@if [ -f "$(BACKEND_DIR)/football_mini_app/settings_local.py" ]; then \
		echo "Локальные настройки уже существуют"; \
	else \
		cp $(BACKEND_DIR)/football_mini_app/settings.py $(BACKEND_DIR)/football_mini_app/settings_local.py; \
		sed -i '' 's/ALLOWED_HOSTS = \[\]/ALLOWED_HOSTS = ["localhost", "127.0.0.1"]/' $(BACKEND_DIR)/football_mini_app/settings_local.py; \
		sed -i '' 's/DEBUG = True/DEBUG = True/' $(BACKEND_DIR)/football_mini_app/settings_local.py; \
		echo "Локальные настройки созданы"; \
	fi

.PHONY: setup-prod
setup-prod:
	@echo "Настройка для домена $(DOMAIN)..."
	@if [ -f "$(BACKEND_DIR)/football_mini_app/settings_prod.py" ]; then \
		echo "Продакшн настройки уже существуют"; \
	else \
		cp $(BACKEND_DIR)/football_mini_app/settings.py $(BACKEND_DIR)/football_mini_app/settings_prod.py; \
		sed -i '' 's/ALLOWED_HOSTS = \[\]/ALLOWED_HOSTS = ["$(DOMAIN)", "www.$(DOMAIN)", "localhost", "127.0.0.1"]/' $(BACKEND_DIR)/football_mini_app/settings_prod.py; \
		sed -i '' 's/DEBUG = True/DEBUG = False/' $(BACKEND_DIR)/football_mini_app/settings_prod.py; \
		sed -i '' 's/CORS_ALLOW_ALL_ORIGINS = True/CORS_ALLOWED_ORIGINS = ["https://$(DOMAIN)", "https://www.$(DOMAIN)", "http://localhost:$(REACT_PORT)"]/' $(BACKEND_DIR)/football_mini_app/settings_prod.py; \
		echo "Продакшн настройки созданы"; \
	fi

.PHONY: backend
backend: setup-local
	@echo "Запуск бэкенд сервера на localhost через Poetry..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py runserver 0.0.0.0:$(DJANGO_PORT) --settings=football_mini_app.settings_local

.PHONY: frontend
frontend:
	@echo "Запуск фронтенд сервера на localhost..."
	cd $(FRONTEND_DIR) && $(NPM) run dev -- --host 0.0.0.0 --port $(REACT_PORT)

.PHONY: backend-local
backend-local:
	@echo "Запуск бэкенд сервера на localhost через Poetry..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py runserver 0.0.0.0:$(DJANGO_PORT) --settings=football_mini_app.settings_local

.PHONY: backend-prod
backend-prod:
	@echo "Запуск бэкенд сервера с доменом $(DOMAIN) через Poetry..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py runserver 0.0.0.0:$(DJANGO_PORT) --settings=football_mini_app.settings_prod

.PHONY: frontend-local
frontend-local:
	@echo "Запуск фронтенд сервера на localhost..."
	cd $(FRONTEND_DIR) && $(NPM) run dev -- --host 0.0.0.0 --port $(REACT_PORT)

.PHONY: frontend-prod
frontend-prod:
	@echo "Запуск фронтенд сервера с доменом $(DOMAIN)..."
	cd $(FRONTEND_DIR) && $(NPM) run dev -- --host $(DOMAIN) --port $(REACT_PORT)

.PHONY: ssl-setup
ssl-setup:
	@echo "Проверка SSL сертификатов для $(DOMAIN)..."
	@if [ ! -d "$(SSL_DIR)" ]; then \
		mkdir -p $(SSL_DIR); \
		echo "Создана директория для SSL сертификатов"; \
	fi
	@if [ ! -f "$(SSL_DIR)/$(DOMAIN).key" ] || [ ! -f "$(SSL_DIR)/$(DOMAIN).crt" ]; then \
		echo "Генерация самоподписанных SSL сертификатов для $(DOMAIN)..."; \
		openssl req -x509 -newkey rsa:4096 -keyout $(SSL_DIR)/$(DOMAIN).key -out $(SSL_DIR)/$(DOMAIN).crt -days 365 -nodes -subj "/CN=$(DOMAIN)"; \
		echo "SSL сертификаты созданы в папке $(SSL_DIR)/"; \
		echo "Добавьте сертификат в доверенные в вашей ОС"; \
	else \
		echo "SSL сертификаты для $(DOMAIN) уже существуют"; \
	fi

.PHONY: setup-hosts
setup-hosts:
	@echo "Настройка hosts файла для домена $(DOMAIN)..."
	@if [ -f "$(SCRIPTS_DIR)/setup_hosts.sh" ]; then \
		$(SCRIPTS_DIR)/setup_hosts.sh; \
	else \
		echo "Скрипт setup_hosts.sh не найден"; \
	fi

.PHONY: check-domain
check-domain:
	@echo "Проверка доступности домена $(DOMAIN)..."
	@if [ -f "$(SCRIPTS_DIR)/check_domain.sh" ]; then \
		$(SCRIPTS_DIR)/check_domain.sh; \
	else \
		echo "Скрипт check_domain.sh не найден"; \
	fi

.PHONY: stop
stop:
	@echo "Остановка сервисов..."
	@pkill -f "python.*manage.py" || true
	@pkill -f "npm run dev" || true
	@pkill -f "poetry run" || true
	@echo "Сервисы остановлены"

.PHONY: clean
clean:
	@echo "Очистка временных файлов..."
	rm -rf __pycache__
	rm -rf $(BACKEND_DIR)/__pycache__
	rm -rf $(BACKEND_DIR)/*.pyc
	rm -rf $(BACKEND_DIR)/.pytest_cache
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/build
	rm -rf $(FRONTEND_DIR)/.parcel-cache
	rm -rf $(SSL_DIR)
	rm -f $(BACKEND_DIR)/football_mini_app/settings_local.py
	rm -f $(BACKEND_DIR)/football_mini_app/settings_prod.py
	@echo "Очистка завершена"

.PHONY: lint
lint:
	@echo "Проверка кода линтерами..."
	cd $(BACKEND_DIR) && $(POETRY) run black --check .
	cd $(BACKEND_DIR) && $(POETRY) run isort --check .
	cd $(BACKEND_DIR) && $(POETRY) run flake8 .
	@echo "Проверка завершена"

.PHONY: format
format:
	@echo "Форматирование кода..."
	cd $(BACKEND_DIR) && $(POETRY) run black .
	cd $(BACKEND_DIR) && $(POETRY) run isort .
	@echo "Форматирование завершено"

.PHONY: test
test:
	@echo "Запуск тестов..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py test

.PHONY: migrate
migrate:
	@echo "Применение миграций..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py migrate

.PHONY: makemigrations
makemigrations:
	@echo "Создание миграций..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py makemigrations

.PHONY: createsuperuser
createsuperuser:
	@echo "Создание суперпользователя..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py createsuperuser

.PHONY: collectstatic
collectstatic:
	@echo "Сбор статических файлов..."
	cd $(BACKEND_DIR) && $(POETRY) run python manage.py collectstatic --noinput

.PHONY: docker-setup
docker-setup:
	@echo "Создание Docker окружения..."
	@if [ ! -f "docker-compose.yml" ]; then \
		echo "version: '3.8'" > docker-compose.yml; \
		echo "services:" >> docker-compose.yml; \
		echo "  backend:" >> docker-compose.yml; \
		echo "    build:" >> docker-compose.yml; \
		echo "      context: ./$(BACKEND_DIR)" >> docker-compose.yml; \
		echo "      dockerfile: Dockerfile" >> docker-compose.yml; \
		echo "    ports:" >> docker-compose.yml; \
		echo "      - \"$(DJANGO_PORT):$(DJANGO_PORT)\"" >> docker-compose.yml; \
		echo "    environment:" >> docker-compose.yml; \
		echo "      - PYTHONPATH=/app" >> docker-compose.yml; \
		echo "    volumes:" >> docker-compose.yml; \
		echo "      - ./$(BACKEND_DIR):/app" >> docker-compose.yml; \
		echo "  frontend:" >> docker-compose.yml; \
		echo "    build: ./$(FRONTEND_DIR)" >> docker-compose.yml; \
		echo "    ports:" >> docker-compose.yml; \
		echo "      - \"$(REACT_PORT):$(REACT_PORT)\"" >> docker-compose.yml; \
		echo "    volumes:" >> docker-compose.yml; \
		echo "      - ./$(FRONTEND_DIR):/app" >> docker-compose.yml; \
		echo "    depends_on:" >> docker-compose.yml; \
		echo "      - backend" >> docker-compose.yml; \
		echo "Файл docker-compose.yml создан"; \
	else \
		echo "docker-compose.yml уже существует"; \
	fi

.PHONY: deploy
deploy: install ssl-setup setup-prod
	@echo "Подготовка к деплою..."
	@echo "Запустите: make run-prod для запуска приложения с доменом $(DOMAIN)"

.PHONY: shell
shell:
	@echo "Запуск shell в виртуальном окружении Poetry..."
	cd $(BACKEND_DIR) && $(POETRY) shell

.PHONY: add-dependency
add-dependency:
	@echo "Добавление зависимости в бэкенд..."
	@if [ -z "$(pkg)" ]; then \
		echo "Использование: make add-dependency pkg=package-name"; \
	else \
		cd $(BACKEND_DIR) && $(POETRY) add $(pkg); \
	fi

.PHONY: add-dev-dependency
add-dev-dependency:
	@echo "Добавление dev-зависимости в бэкенд..."
	@if [ -z "$(pkg)" ]; then \
		echo "Использование: make add-dev-dependency pkg=package-name"; \
	else \
		cd $(BACKEND_DIR) && $(POETRY) add --group dev $(pkg); \
	fi

# Алиасы для удобства
.PHONY: up
up: run

.PHONY: up-prod
up-prod: run-prod

.PHONY: down
down: stop

.PHONY: restart
restart: stop run

.PHONY: restart-prod
restart-prod: stop run-prod