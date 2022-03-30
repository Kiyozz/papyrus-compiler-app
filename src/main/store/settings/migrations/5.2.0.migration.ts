/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import type { Config } from '../../../../common/types/config'
import type { SettingsStore } from '../store'

export function migrate520(store: SettingsStore): void {
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
    store.delete('gameType' as keyof Config)
  }

  if (!is.nullOrUndefined(oldGamePath)) {
    store.set('game.path', oldGamePath)
    store.delete('gamePath' as keyof Config)
  }

  if (!is.nullOrUndefined(oldCompilerPath)) {
    store.set('compilation.compilerPath', oldCompilerPath)
    store.delete('compilerPath' as keyof Config)
  }

  if (!is.nullOrUndefined(oldFlag)) {
    store.set('compilation.flag', oldFlag)
    store.delete('flag' as keyof Config)
  }

  if (!is.nullOrUndefined(oldOutput)) {
    store.set('compilation.output', oldOutput)
    store.delete('output' as keyof Config)
  }
}
