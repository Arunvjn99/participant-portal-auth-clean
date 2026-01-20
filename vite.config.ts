import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Proxy removed - using Netlify Functions in production
    // For local development, use Netlify Dev: netlify dev
    proxy: {
      '/api': {
        target: 'http://localhost:8888' // Netlify Dev server,
        changeOrigin: true,
      },
    },
  },
})
