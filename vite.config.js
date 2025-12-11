import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      // IMPORTANT: do not alias "@firebase" because the Firebase SDK uses that
      // scope for its internal packages (e.g. "@firebase/app", "@firebase/storage").
      // Aliasing it will break bundling by redirecting those imports into /src/firebase.
      '@fb': resolve(__dirname, 'src/firebase'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

