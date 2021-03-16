/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import type { AppStore } from '../store'

export function migrate550(store: AppStore): void {
  const telemetry = store.get('telemetry')
  const tutorials = store.get('tutorials')

  if (is.undefined(telemetry)) {
    store.set('telemetry', { active: true })
  }

  if (is.undefined(tutorials.telemetry)) {
    store.set('tutorials.telemetry', true)
  }
}
