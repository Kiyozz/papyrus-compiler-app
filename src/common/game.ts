export type GameType = 'Skyrim Special Edition' | 'Skyrim Legendary Edition'
export type GamePath = string
export type CompilerPath = string
export type OutputPath = string
export type GameSource = 'Source/Scripts' | 'Scripts/Source'
export type Executable = 'SkyrimSE.exe' | 'TESV.exe'
export type Flag = 'TESV_Papyrus_Flags.flg'

interface Games {
  LE: GameType
  SE: GameType
}

export const Games: Games = {
  LE: 'Skyrim Legendary Edition',
  SE: 'Skyrim Special Edition'
}

export function toSource(game: GameType): GameSource {
  return game === Games.SE ? 'Source/Scripts' : 'Scripts/Source'
}

export function toOtherSource(game: GameType): GameSource {
  return game === Games.SE ? 'Scripts/Source' : 'Source/Scripts'
}

export function getExecutable(game: GameType): Executable {
  return game === Games.SE ? 'SkyrimSE.exe' : 'TESV.exe'
}
