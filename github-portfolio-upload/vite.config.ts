import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'gsap', 'lenis'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
