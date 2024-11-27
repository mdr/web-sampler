import { fixupConfigRules } from '@eslint/compat'
import pluginJs from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import hooksPlugin from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintRecommendedConfig from 'eslint-plugin-react/configs/recommended.js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const tsFilePatterns = ['src/**/*.ts', 'src/**/*.tsx']

const restrictToTsFiles = (config) => ({ files: tsFilePatterns, ...config })

const configs = [
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
  },
  {
    ignores: [
      '.yarn',
      'coverage',
      'dist',
      'playwright-report',
      'playwright/.cache',
      'report',
      'storybook-static',
      'tailwind.config.js',
    ],
  },
  // Suppress type-checking checks on files not covered by TSConfig:
  {
    files: [
      '**/*.js',
      '.storybook/**/*.ts',
      'playwright/**/*.ts',
      'vitest-setup.ts',
      'vite.config.ts',
      'playwright/index.tsx',
      'playwright-ct.config.ts',
    ],
    ...tseslint.configs.disableTypeChecked,
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked.map(restrictToTsFiles),
  ...tseslint.configs.strictTypeChecked.map(restrictToTsFiles),
  ...fixupConfigRules({ ...eslintRecommendedConfig, settings: { react: { version: 'detect' } } }),
  {
    files: tsFilePatterns,
    rules: {
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/unbound-method': 'off',
      'object-shorthand': ['error', 'always'],
      'react-refresh/only-export-components': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
    ignores: ['src/tests/**/*.ts'],
  },
]
export default configs
