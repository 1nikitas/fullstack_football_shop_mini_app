// Конфигурация окружения
export const config = {
    development: {
        apiUrl: 'http://45.153.191.250:8001',
        domain: 'localhost',
        isDev: true
    },
    production: {
        apiUrl: 'https://rooneyform.ru:8000',
        domain: 'rooneyform.ru',
        isDev: false
    }
}

// Определяем текущее окружение
const isDev = import.meta.env.DEV || window.location.hostname === 'localhost'

export const currentConfig = isDev ? config.development : config.production

export default currentConfig
