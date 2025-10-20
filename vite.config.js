import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    minify: 'esbuild',
    cssMinify: 'esbuild',
  },
  server: {
    host: '0.0.0.0',
    port: 12000,
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL',
    },
  },
});
