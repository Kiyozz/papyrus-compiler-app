/*
 * 2026 Kiyozz.
 */

// noinspection JSMethodCanBeStatic

import {
  GameType,
  isCompilerCompatible,
  toCompilerSourceFile,
  toExecutable,
  toExtender,
  toOtherSource,
  toSource,
} from '#common/game.ts'
import { Logger } from '../logger'
import * as path from '../path/path'
import { toDefaultCompilerPath } from '../constants'
import { isExtracted, resolveArchives } from '../utils/ck-archives.util'
import type { CompilerPath, GamePath } from '#common/game.ts'
import type {
  Diagnostic,
  DiagnosticArchive,
  DiagnosticItem,
} from '#common/types/diagnostic.ts'
import { inject } from '#main/inject.ts'
import { SettingsStore } from '#main/store/settings/store.ts'
import type { ResolvedArchive } from '../utils/ck-archives.util'

/**
 * The game whose folder holds `file`, by looking for a game executable next to
 * it then above it. The kits put their compiler one folder below the game root
 * (`Papyrus Compiler`) or two (`Tools/Papyrus Compiler`).
 */
const ownerGame = (file: string): GameType | undefined => {
  let folder = path.parentDir(file)

  for (let depth = 0; depth < 4; depth += 1) {
    const owner = Object.values(GameType).find((type) =>
      path.exists(path.join(folder, toExecutable(type))),
    )

    if (owner !== undefined) {
      return owner
    }

    const parent = path.parentDir(folder)

    if (parent === folder) {
      return undefined
    }

    folder = parent
  }

  return undefined
}

const toDiagnosticArchive = (archive: ResolvedArchive): DiagnosticArchive => ({
  path: archive.path,
  name: archive.name,
  // PCA only extracts zip, the le kit ships a rar
  extractable: archive.kind === 'zip',
})

@inject()
export class ConfigDiagnoseHandler {
  #logger = new Logger('ConfigDiagnoseHandler')
  #settingsStore: SettingsStore

  constructor(settingsStore: SettingsStore) {
    this.#settingsStore = settingsStore
  }

  async listen(): Promise<Diagnostic> {
    const { path: gamePath, type: gameType } = this.#settingsStore.get('game')

    this.#logger.debug('the game type is', gameType)

    if (!this.#hasGameExe(gamePath, gameType)) {
      // nothing else can be trusted when the folder is not the game folder
      return { items: [{ id: 'game-exe', severity: 'error' }] }
    }

    const items: DiagnosticItem[] = []
    const archives = await resolveArchives(gamePath, gameType)
    const hasSources = this.#hasSources(gamePath, gameType)
    // an archive PCA cannot read cannot answer on its own: the game sources
    // are then the only evidence it was ever extracted
    const pending = archives.filter((archive) => {
      const extracted = isExtracted(archive)

      return extracted === undefined ? !hasSources : !extracted
    })
    const hasCompiler = this.#hasCompiler()

    this.#logger.debug('archives', archives.length, 'pending', pending.length)

    if (!hasSources && archives.length === 0) {
      // neither sources nor archives: the kit never ran on this game. Which
      // compiler is configured says nothing here, it can perfectly well be a
      // working one belonging to another game
      items.push({ id: 'ck-missing', severity: 'error' })
    } else {
      if (pending.length > 0) {
        items.push({
          id: 'sources-archived',
          severity: 'error',
          archives: pending.map(toDiagnosticArchive),
        })
      }

      if (!hasSources && pending.length === 0) {
        items.push({ id: 'sources-missing', severity: 'error' })
      }

      if (!hasCompiler) {
        items.push({ id: 'compiler', severity: 'error' })
      } else {
        const foreign = this.#foreignCompiler(gameType)

        if (foreign !== undefined) {
          const own = path.join(gamePath, toDefaultCompilerPath(gameType))

          items.push({
            id: 'compiler-foreign',
            severity: 'error',
            game: foreign,
            compilerPath: path.exists(own) ? own : undefined,
          })
        }
      }
    }

    if (this.#missesExtenderSources(gamePath, gameType)) {
      items.push({ id: 'extender-sources', severity: 'warning' })
    }

    return { items }
  }

  #hasGameExe(gamePath: GamePath, gameType: GameType): boolean {
    this.#logger.debug('checking game exe')

    return path.exists(path.join(gamePath, toExecutable(gameType)))
  }

  #hasSources(gamePath: GamePath, gameType: GameType): boolean {
    this.#logger.debug('checking in game Data folder')

    const file = toCompilerSourceFile(gameType)
    const dataFolder = path.join(gamePath, 'Data')

    return [toSource(gameType), toOtherSource(gameType)].some((source) =>
      path.exists(path.normalize(path.join(dataFolder, source, file))),
    )
  }

  #hasCompiler(): boolean {
    this.#logger.debug('checking compiler path')

    const compilerPath: CompilerPath = this.#settingsStore.get(
      'compilation.compilerPath',
    )

    return path.exists(path.normalize(compilerPath))
  }

  /**
   * The game a foreign compiler belongs to, when PCA can name one. A compiler
   * is never judged on where it lives: PCA aims to work with compilers the
   * Creation Kit never shipped, and Skyrim VR legitimately runs the Special
   * Edition one. Only a compiler positively identified as another, incompatible
   * game's is reported, and identifying it means finding that game's executable
   * above it. A compiler sitting outside any known game keeps the benefit of
   * the doubt.
   */
  #foreignCompiler(gameType: GameType): GameType | undefined {
    const compilerPath: CompilerPath = this.#settingsStore.get(
      'compilation.compilerPath',
    )
    const owner = ownerGame(compilerPath)

    if (owner === undefined || isCompilerCompatible(gameType, owner)) {
      return undefined
    }

    this.#logger.debug('the compiler belongs to', owner)

    return owner
  }

  #missesExtenderSources(gamePath: GamePath, gameType: GameType): boolean {
    const extender = toExtender(gameType)

    if (extender === undefined) {
      return false
    }

    if (!path.exists(path.join(gamePath, extender.loader))) {
      return false
    }

    this.#logger.debug('the script extender is installed, checking its sources')

    return !extender.markers.some((marker) =>
      path.exists(path.normalize(path.join(gamePath, marker))),
    )
  }
}
