import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11', 'iOS >= 12'],
      polyfills: ['es.promise.finally', 'es/map', 'es/set'],
      modernPolyfills: ['es.promise.finally']
    })
  ],
  server: {
    port: 2000
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  }
});
