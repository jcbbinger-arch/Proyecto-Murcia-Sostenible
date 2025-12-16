import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno de forma segura
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: './', 
    define: {
      // Definimos process.env para evitar errores en navegadores si alguna librería lo usa
      // y aseguramos que la API KEY esté disponible
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});