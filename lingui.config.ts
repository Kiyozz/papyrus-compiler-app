import { LinguiConfig } from '@lingui/conf'

export default {
  locales: ['en', 'fr'],
  sourceLocale: 'fr',
  catalogs: [
    {
      path: '<rootDir>/src/renderer/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
} satisfies LinguiConfig
