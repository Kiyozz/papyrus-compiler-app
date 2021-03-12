/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import type { AppStore } from '../store'

export function migrate410(store: AppStore): void {
  if (store.get('mo2.mods') !== 'mods') {
    store.set('mo2.mods', 'mods')
  }
}
