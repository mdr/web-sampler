/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    css: false,
    setupFiles: ['vitest-setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/tests/playwright/**', // This line excludes all tests in the tests/playwright folder
    ],
  },
})
