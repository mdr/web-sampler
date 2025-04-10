import react from '@vitejs/plugin-react'
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import circleDependency from 'vite-plugin-circular-dependency'
import { coverageConfigDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    circleDependency(),
  ],
  test: {
    environment: 'jsdom',
    css: false,
    setupFiles: ['vitest-setup.ts'],
    exclude: ['**/node_modules/**', '**/tests/playwright/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/tests/playwright/**',
        'playwright/index.tsx',
        'tailwind.config.js',
        'postcss.config.js',
        'storybook-static/**',
        ...coverageConfigDefaults.exclude,
        'playwright-ct.config.ts',
      ],
    },
  },
})
