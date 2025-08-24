#!/bin/bash

# Скрипт начальной настройки для Poetry

echo "Настройка Football Mini App с Poetry..."

# Проверка наличия необходимых инструментов
if ! command -v python3 &> /dev/null; then
    echo "Python3 не установлен. Пожалуйста, установите Python3."
    exit 1
fi

if ! command -v poetry &> /dev/null; then
    echo "Poetry не установлен. Установка Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
fi

if ! command -v npm &> /dev/null; then
    echo "NPM не установлен. Пожалуйста, установите Node.js и NPM."
    exit 1
fi

if ! command -v openssl &> /dev/null; then
    echo "OpenSSL не установлен. Пожалуйста, установите OpenSSL."
    exit 1
fi

# Установка зависимостей
echo "Установка зависимостей..."
make install

echo "Настройка завершена!"
echo "Запустите приложение командой: make run"
echo "Для активации виртуального окружения: make shell"