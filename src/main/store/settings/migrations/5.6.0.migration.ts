/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { osLocaleSync } from 'os-locale'
import type { SettingsStore } from '../store'

export function migrate560(store: SettingsStore): void {
  const locale = store.get('locale')

  if (is.undefined(locale)) {
    store.set('locale', osLocaleSync())
  }
}
