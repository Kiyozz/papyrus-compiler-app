/*
 * 2026 Kiyozz.
 */

import { i18n } from '@lingui/core'
import { messages as en } from './locales/en/messages.js'
import { messages as fr } from './locales/fr/messages.js'

i18n.load('fr', fr)

export async function dynamicActivateLocale(locale: 'fr' | 'en') {
  i18n.load(locale, locale === 'fr' ? fr : en)
  i18n.activate(locale)
}
