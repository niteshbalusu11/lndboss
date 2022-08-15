// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    React: 'writable',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@next/next/no-html-link-for-pages': ['error', path.join(__dirname, 'src/client/pages')],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'new-cap': 'error',
    'no-empty-pattern': 'off',
    'no-extra-boolean-cast': 'off',
    'no-control-regex': 'off',
    'no-useless-constructor': 'off',
    'prefer-const': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['off'],
    'react/react-in-jsx-scope': 'error',
    'react/prop-types': 'error',
    'prettier/prettier': 'off',
  },
};
