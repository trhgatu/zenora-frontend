import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});