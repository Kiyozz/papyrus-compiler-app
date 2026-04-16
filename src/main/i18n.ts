/*
 * 2026 Kiyozz.
 */

import { i18n } from '@lingui/core'

export async function dynamicActivateLocale(locale: 'fr' | 'en') {
  const { messages } = await import(`./locales/${locale}/messages.js`)

  i18n.load(locale, messages)
  i18n.activate(locale)
}
