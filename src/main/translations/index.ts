/*
 *   Copyright (c) 2021 Kiyozz
 *   All rights reserved.
 */

import i18next, { TFunction } from 'i18next'

import { settingsStore } from '../store/settings/store'
import en from './en'
import fr from './fr'

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
