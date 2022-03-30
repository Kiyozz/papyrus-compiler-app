module.exports = {
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/react'),
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'import/exports-last': 'error',
    'import/default': 'error',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/tabindex-no-positive': 'off',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
