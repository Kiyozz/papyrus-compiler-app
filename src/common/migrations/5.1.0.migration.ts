import { Game } from '../game'
import { AppStore } from '../store'

export function migrate510(store: AppStore) {
  const gameType: string = store.get('gameType')

  if (gameType === Game.Se || gameType === Game.Le || gameType === Game.Vr) {
    return
  }

  switch (gameType) {
    case 'Skyrim Special Edition':
      store.set('gameType', Game.Se)
      break
    case 'Skyrim Legendary Edition':
      store.set('gameType', Game.Le)
      break
    default:
      store.set('gameType', Game.Se)
  }
}
