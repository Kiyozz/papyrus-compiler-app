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

  const oldGameType = store.get('gameType')
  const oldGamePath = store.get('gamePath')
  const oldCompilerPath = store.get('compilerPath')
  const oldFlag = store.get('flag')
  const oldOutput = store.get('output')

  if (!is.nullOrUndefined(oldGameType)) {
    store.set('game.type', oldGameType)
    store.delete('gameType' as any)
  }

  if (!is.nullOrUndefined(oldGamePath)) {
    store.set('game.path', oldGamePath)
    store.delete('gamePath' as any)
  }

  if (!is.nullOrUndefined(oldCompilerPath)) {
    store.set('compilation.compilerPath', oldCompilerPath)
    store.delete('compilerPath' as any)
  }

  if (!is.nullOrUndefined(oldFlag)) {
    store.set('compilation.flag', oldFlag)
    store.delete('flag' as any)
  }

  if (!is.nullOrUndefined(oldOutput)) {
    store.set('compilation.output', oldOutput)
    store.delete('output' as any)
  }
}
