import { Games } from '../game'
import { AppStore } from '../store'

export function migrate510(store: AppStore) {
  const gameType: string = store.get('gameType')

  if (gameType === Games.SE || gameType === Games.LE || gameType === Games.VR) {
    return
  }

  switch (gameType) {
    case 'Skyrim Special Edition':
      store.set('gameType', Games.SE)
      break
    case 'Skyrim Legendary Edition':
      store.set('gameType', Games.LE)
      break
    default:
      store.set('gameType', Games.SE)
  }
}
