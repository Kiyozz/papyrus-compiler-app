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

export interface CkSteam {
  appId: number
  /** name to look for in the Steam store */
  name: string
  /** the le kit is a Steam tool with no store page: Library > Tools only */
  hasStorePage: boolean
  /** true when the kit belongs to another game, vr borrows the se one */
  isFallback: boolean
}

export interface SourceArchive {
  /** the le kit ships a rar, PCA cannot extract it */
  kind: 'zip' | 'rar'
  /** path relative to the game folder, folder to search when `search` is set */
  from: string
  /**
   * fo4 ships one archive per content, each sitting in the folder it fills:
   * `Scripts/Source/DLC01/DLC01.zip`. Which contents exist depends on the
   * dlc and creations the user owns, so they are searched for, not listed.
   */
  search?: boolean
  /** target relative to the game folder */
  to: string
  /** only entries under this prefix are extracted, their path is kept */
  entryPrefix?: string
}

export interface Extender {
  /** how the community calls it, shown as is */
  name: 'SKSE' | 'F4SE'
  /** loader sitting next to the game executable */
  loader: string
  /** psc that only the extender ships, paths relative to the game folder */
  markers: string[]
  url: string
}

export const toCompilerDir = (game: GameType): string => {
  switch (game) {
    case GameType.sf:
      return 'Tools/Papyrus Compiler'
    default:
      return 'Papyrus Compiler'
  }
}

export const toCkSteam = (game: GameType): CkSteam => {
  switch (game) {
    case GameType.le:
      return {
        appId: 202480,
        name: 'Skyrim Creation Kit',
        hasStorePage: false,
        isFallback: false,
      }
    case GameType.fo4:
      return {
        appId: 1946160,
        name: 'Fallout 4: Creation Kit',
        hasStorePage: true,
        isFallback: false,
      }
    case GameType.sf:
      return {
        appId: 2722710,
        name: 'Starfield: Creation Kit',
        hasStorePage: true,
        isFallback: false,
      }
    default:
      // there is no kit for vr: the se one is installed into the vr folder
      return {
        appId: 1946180,
        name: 'Skyrim Special Edition: Creation Kit',
        hasStorePage: true,
        isFallback: game === GameType.vr,
      }
  }
}

export const toSourceArchives = (game: GameType): SourceArchive[] => {
  switch (game) {
    case GameType.le:
      return [{ kind: 'rar', from: 'Data/Scripts.rar', to: 'Data/Scripts' }]
    case GameType.fo4:
      // every archive carries its own root folder, so they all unfold into
      // Scripts/Source whichever subfolder they were found in
      return [
        {
          kind: 'zip',
          from: 'Data/Scripts/Source',
          search: true,
          to: 'Data/Scripts/Source',
        },
      ]
    case GameType.sf:
      // the archive also holds Materials and Particles, only Scripts is wanted
      return [
        {
          kind: 'zip',
          from: 'Tools/ContentResources.zip',
          to: 'Data',
          entryPrefix: 'Scripts/',
        },
      ]
    default:
      // the se archive holds Source/Scripts and DialogueViews, both go to Data
      return [{ kind: 'zip', from: 'Data/Scripts.zip', to: 'Data' }]
  }
}

export const toExtender = (game: GameType): Extender | undefined => {
  const skse = (loader: string): Extender => ({
    name: 'SKSE',
    loader,
    markers: ['Data/Scripts/Source/SKSE.psc', 'Data/Source/Scripts/SKSE.psc'],
    url: 'https://skse.silverlock.org',
  })

  switch (game) {
    case GameType.le:
      return skse('skse_loader.exe')
    case GameType.se:
      return skse('skse64_loader.exe')
    case GameType.vr:
      return skse('sksevr_loader.exe')
    case GameType.fo4:
      return {
        name: 'F4SE',
        loader: 'f4se_loader.exe',
        markers: [
          'Data/Scripts/Source/User/F4SE.psc',
          'Data/Scripts/Source/F4SE.psc',
        ],
        url: 'https://f4se.silverlock.org',
      }
    default:
      // sfse ships no psc at all, there is nothing to check for sf
      return undefined
  }
}

/** opens the install popup right inside the Steam client */
export const toSteamInstallUrl = (appId: number): string =>
  `steam://install/${appId}`

export const toSteamStoreUrl = (appId: number): string =>
  `https://store.steampowered.com/app/${appId}/`

/**
 * Whether a compiler shipped for `other` can compile `game`. Skyrim VR has no
 * kit of its own and runs the Special Edition one; nothing else crosses over.
 */
export const isCompilerCompatible = (
  game: GameType,
  other: GameType,
): boolean => {
  if (game === other) {
    return true
  }

  const specialEdition: GameType[] = [GameType.se, GameType.vr]

  return specialEdition.includes(game) && specialEdition.includes(other)
}
