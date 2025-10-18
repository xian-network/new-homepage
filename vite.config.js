import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 3,
      },
      mozjpeg: {
        quality: 80,
        progressive: true,
      },
      optipng: {
        optimizationLevel: 5,
      },
      pngquant: {
        quality: [0.7, 0.85],
        speed: 3,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
      webp: {
        quality: 80,
      },
    }),
  ],
  build: {
    minify: 'esbuild',
    cssMinify: 'esbuild',
  },
});
