module.exports = {
  extends: ['eslint:recommended', 'next'],
  plugins: [
    'prettier',
    '@typescript-eslint/parser',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks'
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true
    }
  }
}
