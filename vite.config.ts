import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176, // фиксированный порт
    open: true, // автоматически открывать браузер при запуске
  },
})
