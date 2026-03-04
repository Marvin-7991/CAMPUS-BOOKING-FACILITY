import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3001',
      '/facilities': 'http://localhost:3001',
      '/bookings': 'http://localhost:3001',
      '/users': 'http://localhost:3001',
      '/availability': 'http://localhost:3001',
    },
  },
});
