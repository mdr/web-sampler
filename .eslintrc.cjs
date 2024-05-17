module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    // enable for type-checked rules:
    // 'plugin:@typescript-eslint/strict-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  // for use with @typescript-eslint/strict-type-checked:
  // parserOptions: { project: './tsconfig.json' },
  plugins: ['react-refresh'],
  rules: {
    '@typescript-eslint/no-confusing-void-expression': 'off',
    // for use with @typescript-eslint/strict-type-checked:
    // '@typescript-eslint/restrict-template-expressions': ['error', { 'allowNumber': true }],
    'object-shorthand': ['error', 'always'],
    'react-refresh/only-export-components': 'warn'
  }
}
