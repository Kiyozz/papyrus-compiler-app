/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export type GamePath = string
export type CompilerPath = string
export type OutputPath = string
export type Flag = 'TESV_Papyrus_Flags.flg'

export enum GameSource {
  Le = 'Scripts/Source',
  Se = 'Source/Scripts'
}

export enum Executable {
  Se = 'SkyrimSE.exe',
  Le = 'TESV.exe',
  Vr = 'SkyrimVR.exe'
}

export enum GameType {
  Le = 'Skyrim LE',
  Se = 'Skyrim SE',
  Vr = 'Skyrim VR'
}

export function toSource(game: GameType): GameSource {
  return game === GameType.Le ? GameSource.Le : GameSource.Se
}

export function toOtherSource(game: GameType): GameSource {
  return game === GameType.Le ? GameSource.Se : GameSource.Le
}

export function toExecutable(game: GameType): Executable {
  switch (game) {
    case GameType.Le:
      return Executable.Le
    case GameType.Se:
      return Executable.Se
    case GameType.Vr:
      return Executable.Vr
    default:
      return Executable.Se
  }
}
