import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// used alias for cleaner imports across the project

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@store': path.resolve(__dirname, 'src/app/store'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@features/products': path.resolve(__dirname, 'src/features/products'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
