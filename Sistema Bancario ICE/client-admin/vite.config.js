import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5220',
        changeOrigin: true,
      },
      // AGREGA ESTO para el servicio de banca
      '/BankingService': {
        target: 'http://localhost:3050',
        changeOrigin: true,
      },
    },
  },
});
