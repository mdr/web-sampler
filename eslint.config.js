import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import { fixupConfigRules } from '@eslint/compat'

const limitFiles = (config) => ({
  ...config,
  files: ['src/**/*.{ts,tsx}'],
  ignores: ['.yarn', 'playwright/.cache', '**/*.js'],
})

const configs = [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.jsx'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  ...fixupConfigRules(pluginReactConfig),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
].map(limitFiles)
console.log(configs)
export default configs
