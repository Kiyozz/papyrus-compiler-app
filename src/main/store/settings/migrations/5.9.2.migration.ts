/*
 * 2026 Kiyozz.
 */

import type { SettingsStore } from '../store'

/**
 * Telemetry used to be on by default. Everyone goes back to off and is asked
 * again, whatever they had before.
 */
export function migrate592(store: SettingsStore): void {
  store.set('telemetry', { active: false, asked: false })
}
