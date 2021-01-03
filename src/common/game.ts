/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export type GameType = 'Skyrim SE' | 'Skyrim LE' | 'Skyrim VR'
export type GamePath = string
export type CompilerPath = string
export type OutputPath = string
export type GameSource = 'Source/Scripts' | 'Scripts/Source'
export type Executable = 'SkyrimSE.exe' | 'TESV.exe' | 'SkyrimVR.exe'
export type Flag = 'TESV_Papyrus_Flags.flg'

interface Games {
  LE: GameType
  SE: GameType
  VR: GameType
}

export const Games: Games = {
  LE: 'Skyrim LE',
  SE: 'Skyrim SE',
  VR: 'Skyrim VR'
}

export function toSource(game: GameType): GameSource {
  return game === Games.LE ? 'Scripts/Source' : 'Source/Scripts'
}

export function toOtherSource(game: GameType): GameSource {
  return game === Games.LE ? 'Source/Scripts' : 'Scripts/Source'
}

export function getExecutable(game: GameType): Executable {
  switch (game) {
    case Games.LE:
      return 'TESV.exe'
    case Games.SE:
      return 'SkyrimSE.exe'
    case Games.VR:
      return 'SkyrimVR.exe'
    default:
      return 'SkyrimSE.exe'
  }
}
