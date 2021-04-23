/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export type GamePath = string
export type CompilerPath = string
export type OutputPath = string
export type Flag = 'TESV_Papyrus_Flags.flg' | 'Institute_Papyrus_Flags.flg'
export type CompilerSourceFile = 'Actor.psc' | 'Base/Actor.psc'

export enum GameSource {
  ScriptsFirst = 'Scripts/Source',
  SourceFirst = 'Source/Scripts'
}

export enum Executable {
  Se = 'SkyrimSE.exe',
  Le = 'TESV.exe',
  Vr = 'SkyrimVR.exe',
  Fo4 = 'Fallout4.exe'
}

export enum GameType {
  Le = 'Skyrim LE',
  Se = 'Skyrim SE',
  Vr = 'Skyrim VR',
  Fo4 = 'Fallout 4'
}

export function toSource(game: GameType): GameSource {
  switch (game) {
    case GameType.Le:
    case GameType.Fo4:
      return GameSource.ScriptsFirst
    case GameType.Se:
    case GameType.Vr:
      return GameSource.SourceFirst
    default:
      throw new Error('RuntimeError: unsupported GameType')
  }
}

export function toOtherSource(game: GameType): GameSource {
  switch (game) {
    case GameType.Le:
    case GameType.Fo4:
      return GameSource.SourceFirst
    case GameType.Se:
    case GameType.Vr:
      return GameSource.ScriptsFirst
    default:
      throw new Error('RuntimeError: unsupported GameType')
  }
}

export function toExecutable(game: GameType): Executable {
  switch (game) {
    case GameType.Le:
      return Executable.Le
    case GameType.Se:
      return Executable.Se
    case GameType.Vr:
      return Executable.Vr
    case GameType.Fo4:
      return Executable.Fo4
    default:
      return Executable.Se
  }
}

export function toCompilerSourceFile(game: GameType): CompilerSourceFile {
  switch (game) {
    case GameType.Fo4:
      return 'Base/Actor.psc'
    default:
      return 'Actor.psc'
  }
}
