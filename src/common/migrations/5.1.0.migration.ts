import { GameType } from '../game'
import { AppStore } from '../store'

export function migrate510(store: AppStore) {
  const gameType: string = store.get('gameType')

  if (
    gameType === GameType.Se ||
    gameType === GameType.Le ||
    gameType === GameType.Vr
  ) {
    return
  }

  switch (gameType) {
    case 'Skyrim Special Edition':
      store.set('gameType', GameType.Se)
      break
    case 'Skyrim Legendary Edition':
      store.set('gameType', GameType.Le)
      break
    default:
      store.set('gameType', GameType.Se)
  }
}
