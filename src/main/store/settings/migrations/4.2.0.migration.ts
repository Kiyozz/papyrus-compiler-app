/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import * as path from 'path'
import is from '@sindresorhus/is'
import * as util from 'electron-util'
import { toAntiSlash, toSlash } from '../../../slash'
import type { SettingsStore } from '../store'

export function migrate420(store: SettingsStore): void {
  const gamePath = store.get('game.path')
  const compilerPath = store.get('compilation.compilerPath')

  if (is.nonEmptyString(gamePath) && is.nonEmptyString(compilerPath)) {
    const slashFunc = util.is.linux || util.is.macos ? toSlash : toAntiSlash

    store.set(
      'compilation.compilerPath',
      slashFunc(path.join(gamePath, compilerPath)),
    )
  }
}
