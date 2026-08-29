import { defineConfig } from '@lingui/conf'

export default defineConfig({
  locales: ['en', 'fr'],
  sourceLocale: 'fr',
  catalogs: [
    {
      path: '<rootDir>/src/renderer/locales/{locale}/messages',
      include: ['src/renderer'],
    },
  ],
})
