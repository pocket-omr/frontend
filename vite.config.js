import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pin the dev port so the origin (and therefore localStorage, where exams are
  // stored) stays the same across reruns. strictPort makes Vite fail loudly if
  // 5173 is already taken instead of silently moving to 5174 and "losing" data.
  server: {
    port: 5173,
    strictPort: true,
  },
})
