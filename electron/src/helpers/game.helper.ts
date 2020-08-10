import { GameType } from '../types/game.type'

export function toSource(game: GameType): string {
  return game === 'Skyrim Special Edition' ? 'Source/Scripts' : 'Scripts/Source'
}

export function toOtherSource(game: GameType): string {
  return game === 'Skyrim Special Edition' ? 'Scripts/Source' : 'Source/Scripts'
}

export function getExecutable(game: GameType): string {
  return game === 'Skyrim Special Edition' ? 'SkyrimSE.exe' : 'TESV.exe'
}
