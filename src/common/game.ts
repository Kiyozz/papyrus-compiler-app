/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'

export type GamePath = string
export type CompilerPath = string
export type OutputPath = string
export type Flag =
  | 'TESV_Papyrus_Flags.flg'
  | 'Institute_Papyrus_Flags.flg'
  | 'Starfield_Papyrus_Flags.flg'
export type CompilerSourceFile = 'Actor.psc' | 'Base/Actor.psc'

export enum GameSource {
  scriptsFirst = 'Scripts/Source',
  sourceFirst = 'Source/Scripts',
}

export enum Executable {
  se = 'SkyrimSE.exe',
  le = 'TESV.exe',
  vr = 'SkyrimVR.exe',
  fo4 = 'Fallout4.exe',
  sf = 'Starfield.exe',
}

export enum GameType {
  le = 'Skyrim LE',
  se = 'Skyrim SE',
  vr = 'Skyrim VR',
  fo4 = 'Fallout 4',
  sf = 'Starfield',
}

export const toSource = (game: GameType): GameSource => {
  switch (game) {
    case GameType.le:
    case GameType.fo4:
    case GameType.sf:
      return GameSource.scriptsFirst
    case GameType.se:
    case GameType.vr:
      return GameSource.sourceFirst
    default:
      throw new Error('RuntimeError: unsupported GameType')
  }
}

export const toOtherSource = (game: GameType): GameSource => {
  switch (game) {
    case GameType.le:
    case GameType.fo4:
    case GameType.sf:
      return GameSource.sourceFirst
    case GameType.se:
    case GameType.vr:
      return GameSource.scriptsFirst
    default:
      throw new Error('RuntimeError: unsupported GameType')
  }
}

export const toExecutable = (game: GameType): Executable => {
  switch (game) {
    case GameType.le:
      return Executable.le
    case GameType.se:
      return Executable.se
    case GameType.vr:
      return Executable.vr
    case GameType.fo4:
      return Executable.fo4
    case GameType.sf:
      return Executable.sf
    default:
      // falling back without a word made a corrupted game type look like the
      // user had picked Skyrim SE, pointing every error at the wrong game
      console.error(
        `RuntimeError: unsupported GameType "${game}", falling back to ${Executable.se}`,
      )

      return Executable.se
  }
}

export const toCompilerSourceFile = (game: GameType): CompilerSourceFile => {
  switch (game) {
    case GameType.fo4:
      return 'Base/Actor.psc'
    default:
      return 'Actor.psc'
  }
}

export const toFlag = (game: GameType): Flag => {
  switch (game) {
    case GameType.fo4:
      return 'Institute_Papyrus_Flags.flg'
    case GameType.sf:
      return 'Starfield_Papyrus_Flags.flg'
    default:
      return 'TESV_Papyrus_Flags.flg'
  }
}

export const validateGame = {
  flag: (flag?: Flag | string): flag is Flag => {
    switch (flag) {
      case 'TESV_Papyrus_Flags.flg':
      case 'Institute_Papyrus_Flags.flg':
      case 'Starfield_Papyrus_Flags.flg':
        return true
    }

    return false
  },
  gameType: (type?: GameType): type is GameType => {
    if (is.undefined(type)) return false

    switch (type) {
      case GameType.se:
      case GameType.le:
      case GameType.vr:
      case GameType.fo4:
      case GameType.sf:
        return true
    }

    return false
  },
  gamePath: (path?: GamePath): path is GamePath => {
    if (is.undefined(path)) return false

    return is.nonEmptyString(path.trim())
  },
  compilerPath(path?: CompilerPath): path is CompilerPath {
    return this.gamePath(path)
  },
  outputPath(path?: OutputPath): path is OutputPath {
    return this.gamePath(path)
  },
}
