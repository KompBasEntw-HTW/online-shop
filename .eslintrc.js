module.exports = {
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended', 'next/typescript'],
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    }
  },
  plugins: ['@typescript-eslint']
}
