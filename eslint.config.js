import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import { fixupConfigRules } from '@eslint/compat'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsParser from '@typescript-eslint/parser'

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
    ignores: ['.yarn', 'playwright/.cache', 'storybook-static', 'dist', 'tailwind.config.js'],
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
  ...fixupConfigRules({ ...pluginReactConfig, settings: { react: { version: 'detect' } } }),
  {
    files: tsFilePatterns,
    rules: {
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-inferrable-types': 'off',
      'object-shorthand': ['error', 'always'],
      'react-refresh/only-export-components': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]
export default configs
