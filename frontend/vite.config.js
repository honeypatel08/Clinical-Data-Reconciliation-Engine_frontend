import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Clinical-Data-Reconciliation-Engine_frontend/', // matches your homepage path
});