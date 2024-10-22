/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:svelte/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  globals: {
    $$Generic: 'readable',
    $$Slots: 'readable',
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['*.js', '*.cjs'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  rules: {
    // this rule is interfering with $$Generic, so we'll disable it for now
    // see: https://github.com/sveltejs/eslint-plugin-svelte/issues/541
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        // allow unused function parameters that start with an underscore
        argsIgnorePattern: '^_',
        // allow destructuring of unused array elements that start with an underscore
        destructuredArrayIgnorePattern: '^_',
        // allow destructuring of unused fields in order to shrink an object shape
        ignoreRestSiblings: true,
        varsIgnorePattern: '^\\$\\$(Props|Events|Slots)$',
      },
    ],
  },
}
