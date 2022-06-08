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
    'new-cap': 'off',
    'no-empty-pattern': 'off',
    'no-extra-boolean-cast': 'off',
    'no-control-regex': 'off',
    'no-useless-constructor': 'off',
    'prefer-const': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['off'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
