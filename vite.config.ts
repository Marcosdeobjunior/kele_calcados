/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  // Subcaminho de publicação (ex.: "/kele_calcados/" no GitHub Pages). Padrão: raiz.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  test: { environment: 'node' },
});
