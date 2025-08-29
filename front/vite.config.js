import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'rooneyform.ru',
      'www.rooneyform.ru',
      'e3a4adaedb71.ngrok-free.app',
      '45.153.191.250',
      'rooneyform.store',
      'www.rooneyform.store',
    ],
    cors: true,
    hmr: {
      host: 'localhost'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
})
