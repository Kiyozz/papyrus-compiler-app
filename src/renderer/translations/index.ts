/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { use } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { fr } from './fr'

export const loadTranslations = () => {
  void use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: { ...en },
        },
        fr: {
          translation: { ...fr },
        },
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    })
}
