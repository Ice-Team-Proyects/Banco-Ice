import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5210',
        changeOrigin: true,
      },
      '/banking': {
        target: 'http://localhost:3050',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/banking/, '/BankingService'),
      },
    },
  },
});