/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import * as util from 'electron-util'
import * as path from 'path'

import { toAntiSlash, toSlash } from '../slash'
import type { AppStore } from '../store'

export function migrate420(store: AppStore): void {
  const gamePath = store.get('game.path')
  const compilerPath = store.get('compilation.compilerPath')

  if (is.nonEmptyString(gamePath) && is.nonEmptyString(compilerPath)) {
    const slashFunc = util.is.linux || util.is.macos ? toSlash : toAntiSlash

    store.set(
      'compilation.compilerPath',
      slashFunc(path.join(gamePath, compilerPath))
    )
  }
}
