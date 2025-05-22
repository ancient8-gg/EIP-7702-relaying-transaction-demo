import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/EIP-7702-relaying-transaction-demo/',
  plugins: [react(), tailwindcss()],
});
