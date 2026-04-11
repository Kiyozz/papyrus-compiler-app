/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import osLocale from 'os-locale'
import type { SettingsStore } from '../store'

export function migrate560(store: SettingsStore): void {
  const locale = store.get('locale')

  if (is.undefined(locale)) {
    store.set('locale', osLocale())
  }
}
