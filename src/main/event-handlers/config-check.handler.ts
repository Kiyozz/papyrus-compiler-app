/*
 * 2026 Kiyozz.
 */

// noinspection JSMethodCanBeStatic

import {
  toCompilerSourceFile,
  toExecutable,
  toOtherSource,
  toSource,
} from '#common/game.ts'
import { Logger } from '../logger'
import * as path from '../path/path'
import type { CompilerPath, GamePath, GameType } from '#common/game.ts'
import type { BadError } from '#common/types/bad-error.ts'
import { inject } from '#main/inject.ts'
import { SettingsStore } from '#main/store/settings/store.ts'

@inject()
export class ConfigCheckHandler {
  #logger = new Logger('ConfigCheckHandler')
  #settingsStore: SettingsStore

  constructor(settingsStore: SettingsStore) {
    this.#settingsStore = settingsStore
  }

  async listen(): Promise<BadError> {
    const gameType: GameType = this.#settingsStore.get('game.type')

    this.#logger.debug('the game type is', gameType)

    const hasGameExe = await this.checkGameExe()

    if (hasGameExe !== false) {
      return hasGameExe
    }

    const hasCompiler = await this.checkCompiler()

    if (hasCompiler !== false) {
      return hasCompiler
    }

    const file = toCompilerSourceFile(gameType)

    return this.checkInGameDataFolder(file)
  }

  private checkGameExe(): Promise<BadError> {
    this.#logger.debug('checking game exe')

    const { path: gamePath, type: gameType } = this.#settingsStore.get('game')
    const executable = toExecutable(gameType)

    return Promise.resolve(
      path.exists(path.join(gamePath, executable)) ? false : 'game',
    )
  }

  private checkInGameDataFolder(file: string): Promise<BadError> {
    const gamePath: GamePath = this.#settingsStore.get('game.path')
    const gameType: GameType = this.#settingsStore.get('game.type')
    this.#logger.debug('checking in game Data folder')

    const gameScriptsFolder = path.join(
      gamePath,
      'Data',
      toSource(gameType),
      file,
    )

    const result = path.exists(path.normalize(gameScriptsFolder))

    if (!result) {
      const otherGameScriptsFolder = path.join(
        gamePath,
        'Data',
        toOtherSource(gameType),
        file,
      )

      const otherResult = path.exists(path.normalize(otherGameScriptsFolder))

      if (otherResult) {
        return Promise.resolve(false)
      }

      return Promise.resolve('scripts')
    }

    return Promise.resolve(false)
  }

  private checkCompiler(): Promise<BadError> {
    this.#logger.debug('checking compiler path')

    const compilerPath: CompilerPath = this.#settingsStore.get(
      'compilation.compilerPath',
    )

    return Promise.resolve(
      path.exists(path.normalize(compilerPath)) ? false : 'compiler',
    )
  }
}
