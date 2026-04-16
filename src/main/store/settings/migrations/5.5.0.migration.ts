/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { Theme } from '../../../../common/theme'
import type { SettingsStore } from '../store'

export function migrate550(store: SettingsStore): void {
  const telemetry = store.get('telemetry')
  const theme = store.get('theme')

  if (is.undefined(telemetry)) {
    store.set('telemetry', { active: true })
  }

  if (is.undefined(theme)) {
    store.set('theme', Theme.system)
  }
}
