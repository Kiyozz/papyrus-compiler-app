/*
 * 2026 Kiyozz.
 */

// noinspection JSMethodCanBeStatic

import is from '@sindresorhus/is'
import {
  toCompilerSourceFile,
  toExecutable,
  toOtherSource,
  toSource,
} from '#common/game.ts'
import { Logger } from '../logger'
import * as path from '../path/path'
import { toSlash } from '../slash'
import type {
  CompilerPath,
  CompilerSourceFile,
  GamePath,
  GameType,
} from '#common/game.ts'
import type { BadError } from '#common/types/bad-error.ts'
import { inject } from '#main/inject.ts'
import { SettingsStore } from '#main/store/settings/store.ts'
import { Mo2Service } from '#main/mo2/mo2.ts'

interface Args {
  checkMo2: boolean
}

@inject()
export class ConfigCheckHandler {
  #logger = new Logger('ConfigCheckHandler')
  #settingsStore: SettingsStore
  #mo2: Mo2Service

  constructor(settingsStore: SettingsStore, mo2: Mo2Service) {
    this.#settingsStore = settingsStore
    this.#mo2 = mo2
  }

  async listen({ checkMo2 }: Args = { checkMo2: false }): Promise<BadError> {
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
    const isUsingMo2: boolean = this.#settingsStore.get('mo2.use')

    if (isUsingMo2) {
      const hasMo2Instance = this.checkMo2Instance(checkMo2)

      if (hasMo2Instance !== false) {
        return hasMo2Instance
      }
    }

    return isUsingMo2 ? this.checkInMo2(file) : this.checkInGameDataFolder(file)
  }

  private checkGameExe(): Promise<BadError> {
    this.#logger.debug('checking game exe')

    const { path: gamePath, type: gameType } = this.#settingsStore.get('game')
    const executable = toExecutable(gameType)

    return Promise.resolve(
      path.exists(path.join(gamePath, executable)) ? false : 'game',
    )
  }

  private checkMo2Instance(checkMo2: boolean): BadError {
    this.#logger.debug('checking mo2 instance')
    const { use: mo2Use, instance: mo2Instance } =
      this.#settingsStore.get('mo2')

    if (checkMo2 && mo2Use && is.undefined(mo2Instance)) {
      return 'mo2-use-no-instance'
    }

    if (!mo2Instance || (mo2Use && mo2Instance && !path.exists(mo2Instance))) {
      return 'mo2-instance'
    }

    try {
      // check this path
      this.#mo2.getModsPath(mo2Instance)
    } catch {
      return 'mo2-instance-mods'
    }

    return false
  }

  private async checkInMo2(file: CompilerSourceFile): Promise<BadError> {
    const gameType: GameType = this.#settingsStore.get('game.type')
    const mo2 = this.#settingsStore.get('mo2')

    if (is.undefined(mo2.instance)) {
      return this.checkInGameDataFolder(file)
    }

    this.#logger.info('checking in mo2 folder')

    const sourcesFolder = toSource(gameType)
    const otherSourcesFolder = toOtherSource(gameType)
    const modsPath = path.join(mo2.instance, mo2.mods)

    const pathToChecks = [
      path.join(modsPath, '**', sourcesFolder, file),
      path.join(modsPath, '**', otherSourcesFolder, file),
      path.join(mo2.instance, 'overwrite', sourcesFolder, file),
      path.join(mo2.instance, 'overwrite', otherSourcesFolder, file),
    ].map((folder) => path.normalize(toSlash(folder)))

    const files = await path.getPathsInFolder([...pathToChecks], {
      absolute: true,
      deep: 4,
    })

    return files.length === 0 ? this.checkInGameDataFolder(file) : false
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
