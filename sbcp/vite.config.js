import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'react-toastify'
    ],
    exclude: [
      'sockjs-client',
      '@stomp/stompjs'
    ]
  },
  server: {
    port: 5173,
    host: true
  }
})