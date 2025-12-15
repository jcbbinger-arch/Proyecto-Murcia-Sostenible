import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', // Ensures assets are linked relatively for Vercel/Static hosting
    define: {
      // Securely replace process.env.API_KEY with the string value from environment
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});