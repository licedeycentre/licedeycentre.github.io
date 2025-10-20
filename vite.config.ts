import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Для licedeycentre.github.io (корень домена)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
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
