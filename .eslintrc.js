module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['karma.conf.js'],
  rules: {
    '@typescript-eslint/no-empty-function': ['Off'],
    'prettier/prettier': 2,
  },
  root: true,
};
