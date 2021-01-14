/*
 * Copyright (c) 2020 Kiyozz.
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

export enum Game {
  Le = 'Skyrim LE',
  Se = 'Skyrim SE',
  Vr = 'Skyrim VR'
}

export function toSource(game: Game): GameSource {
  return game === Game.Le ? GameSource.Le : GameSource.Se
}

export function toOtherSource(game: Game): GameSource {
  return game === Game.Le ? GameSource.Se : GameSource.Le
}

export function toExecutable(game: Game): Executable {
  switch (game) {
    case Game.Le:
      return Executable.Le
    case Game.Se:
      return Executable.Se
    case Game.Vr:
      return Executable.Vr
    default:
      return Executable.Se
  }
}
