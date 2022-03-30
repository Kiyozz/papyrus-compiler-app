/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { GameType } from '../../../../common/game'
import { Logger } from '../../../logger'
import type { SettingsStore } from '../store'

const _logger = new Logger('migration-5.1.0')

/**
 * Migrate old game type to the new format
 */
export function migrate510(store: SettingsStore): void {
  _logger.debug('starting')
  const gameType = store.get('game.type')

  if (
    gameType === GameType.se ||
    gameType === GameType.le ||
    gameType === GameType.vr ||
    gameType === GameType.fo4
  ) {
    _logger.debug('do not need to migrate')

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

  _logger.debug('complete')
}
