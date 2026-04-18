/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { LogLevel } from '#common/log-level.ts'
import type { SettingsStore } from '../store'

export function migrate590(store: SettingsStore): void {
  const logLevel = store.get('logLevel')

  if (is.undefined(logLevel)) {
    store.set('logLevel', LogLevel.info)
  }
}
