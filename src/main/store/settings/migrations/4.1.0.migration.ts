/*
 * 2022-2026 Kiyozz.
 */

import type { SettingsStore } from '../store'

export function migrate410(store: SettingsStore): void {
  // legacy: mo2.mods removed in 5.9.0 — no-op kept for migration ordering
  void store
}
