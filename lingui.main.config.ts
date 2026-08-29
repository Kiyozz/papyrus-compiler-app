import { defineConfig } from '@lingui/conf'

export default defineConfig({
  locales: ['en', 'fr'],
  sourceLocale: 'fr',
  catalogs: [
    {
      path: '<rootDir>/src/main/locales/{locale}/messages',
      include: ['src/main'],
    },
  ],
  compileNamespace: 'ts',
})
