import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are linked relatively
  define: {
    // Polyfill process.env so the client can access API_KEY safely
    'process.env': {
      API_KEY: process.env.API_KEY || ''
    }
  }
});