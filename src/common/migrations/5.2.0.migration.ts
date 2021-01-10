/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { AppStore } from '../store'

export function migrate520(store: AppStore) {
  const tutorials = store.get('tutorials')

  if (is.undefined(tutorials)) {
    store.set('tutorials', { settings: false })
  }
}
