import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: ['src/renderer/routeTree.gen.ts'],
  plugins: ['typescript', 'import'],
  env: { node: true },
  rules: {
    'typescript/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'typescript/no-var-requires': 'error',
    'import/no-cycle': 'error',
    'import/default': 'error',
    'import/exports-last': 'error',
    'import/first': 'error',
  },
})
