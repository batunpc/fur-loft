import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
    assetsInclude: [
      '**/*.jpeg',
      '**/*.jpg',
      '**/*.png',
      '**/*.svg',
      '**/*.gif',
    ],
    copyPublicDir: true,
  },
});
