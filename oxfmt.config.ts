import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: [
    'src/renderer/routeTree.gen.ts',
    'src/main/locales/*/messages.ts',
  ],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
})
