/*
 * 2022-2026 Kiyozz.
 */

import { init } from 'i18next'
import { settingsStore } from '../store/settings/store'
import { en } from './en'
import { fr } from './fr'

const locale = settingsStore.get('locale').includes('fr') ? 'fr' : 'en'

export const instance = init({
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
  lng: locale,
  fallbackLng: 'en',
})
