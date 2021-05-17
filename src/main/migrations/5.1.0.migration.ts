/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { GameType } from '../../common/game'

import type { AppStore } from '../store'

export function migrate510(store: AppStore): void {
  const gameType: string = store.get('game.type')

  if (
    gameType === GameType.se ||
    gameType === GameType.le ||
    gameType === GameType.vr
  ) {
    return
  }

  switch (gameType) {
    case 'Skyrim Special Edition':
      store.set('game.type', GameType.se)
      break
    case 'Skyrim Legendary Edition':
      store.set('game.type', GameType.le)
      break
    default:
      store.set('game.type', GameType.se)
  }
}
