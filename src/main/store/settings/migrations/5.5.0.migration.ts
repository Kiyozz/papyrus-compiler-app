/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { Theme } from '../../../../common/theme'
import type { SettingsStore } from '../store'

export function migrate550(store: SettingsStore): void {
  const telemetry = store.get('telemetry')
  const tutorials = store.get('tutorials')
  const theme = store.get('theme')

  if (is.undefined(telemetry)) {
    store.set('telemetry', { active: true })
  }

  if (is.undefined(tutorials.telemetry)) {
    store.set('tutorials.telemetry', true)
  }

  if (is.undefined(theme)) {
    store.set('theme', Theme.system)
  }
}
