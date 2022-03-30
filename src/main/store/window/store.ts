/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { screen } from 'electron'
import Store from 'electron-store'

interface StoreValues {
  x: number | null
  y: number | null
}

type Checker = (store: WindowStore) => boolean

function validatePosition(store: WindowStore): boolean {
  const { x, y } = store.store

  if ((!is.null_(x) && !is.number(x)) || (!is.null_(y) && !is.number(y))) {
    store.reset()

    return false
  }

  return true
}

function validateCurrentScreen(store: WindowStore, checkers: Checker[]) {
  const allScreens = screen.getAllDisplays()

  if (checkers.some(checker => checker(store))) {
    const { x, y } = store.store

    if (is.null_(x) || is.null_(y)) {
      return
    }

    allScreens.forEach(monitor => {
      const { width, height } = monitor.size

      if (x > width || y > height) {
        store.reset()
      }
    })
  }
}

export type WindowStore = Store<StoreValues>

export const createWindowStore = (): WindowStore => {
  const store = new Store<StoreValues>({
    defaults: {
      x: null,
      y: null,
    },
    name: 'pca_window',
  })

  validateCurrentScreen(store, [validatePosition])

  return store
}
