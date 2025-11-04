import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Для licedeycentre.github.io (корень домена)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor код
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'yet-another-react-lightbox'],

          // Тяжелый контент в отдельные чанки
          'content-performances': ['./src/content/performances.json'],
          'content-publications': ['./src/content/publications.json'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 5175,
    open: true,
    fs: {
      allow: ['..'],
    },
  },
  define: {
    global: 'globalThis',
  },
})
