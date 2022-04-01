// noinspection JSMethodCanBeStatic

/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import {
  toCompilerSourceFile,
  toExecutable,
  toOtherSource,
  toSource,
} from '../../common/game'
import { IpcEvent } from '../ipc-event'
import { Logger } from '../logger'
import { getModsPath } from '../mo2/mo2'
import * as path from '../path/path'
import { toSlash } from '../slash'
import { settingsStore } from '../store/settings/store'
import type { EventHandler } from '../interfaces/event-handler'
import type {
  CompilerPath,
  CompilerSourceFile,
  GamePath,
  GameType,
} from '../../common/game'
import type { BadError } from '../../common/types/bad-error'

const _logger = new Logger(IpcEvent.configCheck)

interface Args {
  checkMo2: boolean
}

export class ConfigCheckHandler implements EventHandler {
  async listen({ checkMo2 }: Args = { checkMo2: false }): Promise<BadError> {
    const gameType: GameType = settingsStore.get('game.type')

    _logger.debug('the game type is', gameType)

    const hasGameExe = await this.checkGameExe()

    if (hasGameExe !== false) {
      return hasGameExe
    }

    const hasCompiler = await this.checkCompiler()

    if (hasCompiler !== false) {
      return hasCompiler
    }

    const file = toCompilerSourceFile(gameType)
    const isUsingMo2: boolean = settingsStore.get('mo2.use')

    if (isUsingMo2) {
      const hasMo2Instance = this.checkMo2Instance(checkMo2)

      if (hasMo2Instance !== false) {
        return hasMo2Instance
      }
    }

    return isUsingMo2 ? this.checkInMo2(file) : this.checkInGameDataFolder(file)
  }

  private checkGameExe(): Promise<BadError> {
    _logger.debug('checking game exe')

    const { path: gamePath, type: gameType } = settingsStore.get('game')
    const executable = toExecutable(gameType)

    return Promise.resolve(
      path.exists(path.join(gamePath, executable)) ? false : 'game',
    )
  }

  private checkMo2Instance(checkMo2: boolean): BadError {
    _logger.debug('checking mo2 instance')
    const { use: mo2Use, instance: mo2Instance } = settingsStore.get('mo2')

    if (checkMo2 && mo2Use && is.undefined(mo2Instance)) {
      return 'mo2-use-no-instance'
    }

    if (!mo2Instance || (mo2Use && mo2Instance && !path.exists(mo2Instance))) {
      return 'mo2-instance'
    }

    try {
      // check this path
      getModsPath(mo2Instance)
    } catch (err) {
      return 'mo2-instance-mods'
    }

    return false
  }

  private async checkInMo2(file: CompilerSourceFile): Promise<BadError> {
    const gameType: GameType = settingsStore.get('game.type')
    const mo2 = settingsStore.get('mo2')

    if (is.undefined(mo2.instance)) {
      return this.checkInGameDataFolder(file)
    }

    _logger.info('checking in mo2 folder')

    const sourcesFolder = toSource(gameType)
    const otherSourcesFolder = toOtherSource(gameType)
    const modsPath = path.join(mo2.instance, mo2.mods)

    const pathToChecks = [
      path.join(modsPath, '**', sourcesFolder, file),
      path.join(modsPath, '**', otherSourcesFolder, file),
      path.join(mo2.instance, 'overwrite', sourcesFolder, file),
      path.join(mo2.instance, 'overwrite', otherSourcesFolder, file),
    ].map(folder => path.normalize(toSlash(folder)))

    const files = await path.getPathsInFolder([...pathToChecks], {
      absolute: true,
      deep: 4,
    })

    return files.length === 0 ? this.checkInGameDataFolder(file) : false
  }

  private checkInGameDataFolder(file: string): Promise<BadError> {
    const gamePath: GamePath = settingsStore.get('game.path')
    const gameType: GameType = settingsStore.get('game.type')
    _logger.debug('checking in game Data folder')

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
    _logger.debug('checking compiler path')

    const compilerPath: CompilerPath = settingsStore.get(
      'compilation.compilerPath',
    )

    return Promise.resolve(
      path.exists(path.normalize(compilerPath)) ? false : 'compiler',
    )
  }
}
