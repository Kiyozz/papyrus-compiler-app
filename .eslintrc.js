module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    '@typescript-eslint/brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: false
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase']
      }
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-parens': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/quotes': [
      'warn',
      'single',
      {
        avoidEscape: true
      }
    ],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/semi': ['warn', 'never'],
    '@typescript-eslint/type-annotation-spacing': 'error',
    'arrow-spacing': 'warn',
    'block-spacing': ['warn', 'always'],
    'brace-style': 'off',
    'comma-spacing': 'error',
    'comma-style': ['error', 'last'],
    'constructor-super': 'error',
    curly: 'error',
    'eol-last': ['warn', 'always'],
    eqeqeq: 'error',
    'func-call-spacing': ['warn', 'never'],
    'generator-star-spacing': [
      'warn',
      {
        before: false,
        after: true
      }
    ],
    'guard-for-in': 'error',
    'handle-callback-err': 'error',
    indent: 'off',
    'key-spacing': [
      'warn',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict'
      }
    ],
    'keyword-spacing': [
      'warn',
      {
        before: true,
        after: true
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'newline-after-var': 'off',
    'newline-before-return': 'off',
    'no-debugger': 'warn',
    'no-else-return': 'warn',
    'no-empty-pattern': 'warn',
    'no-extra-bind': 'off',
    'no-extra-parens': 'off',
    'no-lonely-if': 'warn',
    'no-path-concat': 'error',
    'no-return-await': 'error',
    'no-shadow': 'off',
    'no-this-before-super': 'error',
    'no-trailing-spaces': 'warn',
    'no-unused-vars': 'off',
    'no-useless-catch': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-return': 'warn',
    'no-var': 'error',
    'object-curly-spacing': ['warn', 'always'],
    'one-var': ['error', 'never'],
    'prefer-destructuring': 'off',
    'prefer-template': 'warn',
    quotes: 'off',
    'react/prop-types': 'off',
    'require-await': 'warn',
    'rest-spread-spacing': ['error'],
    semi: 'off',
    'space-before-blocks': 'warn',
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-in-parens': ['warn', 'never'],
    'space-infix-ops': 'warn',
    'switch-colon-spacing': 'warn',
    'template-curly-spacing': ['warn', 'never'],
    'valid-typeof': 'error'
  },
  settings: {
    react: {
      version: '16.13'
    }
  }
}
