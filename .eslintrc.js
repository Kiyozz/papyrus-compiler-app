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
  ],
}
