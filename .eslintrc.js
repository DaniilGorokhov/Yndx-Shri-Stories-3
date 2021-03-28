module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
  ],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    'import/extensions': [
      '.js',
      '.ts',
    ],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'default-case': 'off',
    'max-len': [
      2,
      {
        code: 120,
      },
    ],
  },
};
