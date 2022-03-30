/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import i18next from 'i18next'
import { settingsStore } from '../store/settings/store'
import en from './en'
import fr from './fr'
import type { TFunction } from 'i18next';

const locale = settingsStore.get('locale').includes('fr') ? 'fr' : 'en'
const instance = i18next.init({
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

export default function getInstance(): Promise<TFunction> {
  return instance
}
