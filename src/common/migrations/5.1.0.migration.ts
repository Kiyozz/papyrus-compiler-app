import { GameType } from '../game'
import { AppStore } from '../store'

export function migrate510(store: AppStore) {
  const gameType: string = store.get('game.type')

  if (
    gameType === GameType.Se ||
    gameType === GameType.Le ||
    gameType === GameType.Vr
  ) {
    return
  }

  switch (gameType) {
    case 'Skyrim Special Edition':
      store.set('game.type', GameType.Se)
      break
    case 'Skyrim Legendary Edition':
      store.set('game.type', GameType.Le)
      break
    default:
      store.set('game.type', GameType.Se)
  }
}
