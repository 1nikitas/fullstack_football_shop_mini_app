// Конфигурация окружения
export const config = {
    development: {
        apiUrl: 'https://rooneyform.store',
        domain: 'localhost',
        isDev: true
    },
    production: {
        apiUrl: 'https://rooneyform.store',
        domain: 'rooneyform.ru',
        isDev: false
    }
}

// Определяем текущее окружение
const isDev = import.meta.env.DEV || window.location.hostname === 'localhost'

export const currentConfig = isDev ? config.development : config.production

export default currentConfig
