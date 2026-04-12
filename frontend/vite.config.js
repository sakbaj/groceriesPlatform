import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Only use 'base' if deploying to GitHub Pages
  // base: '/your-repo-name/', 
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // This only works during 'npm run dev'
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true only if you need to debug in production
  },
});
