/*
 * 2022-2026 Kiyozz.
 */

import type { SettingsStore } from '../store'

export function migrate410(store: SettingsStore): void {
  if (store.get('mo2.mods') !== 'mods') {
    store.set('mo2.mods', 'mods')
  }
}
