/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import {
  CompilerSourceFile,
  GameType,
  toCompilerSourceFile,
  toExecutable,
  toOtherSource,
  toSource,
} from '../../common/game'
import { BadError } from '../../common/interfaces/bad-error'
import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import * as path from '../path/path'
import { toSlash } from '../slash'
import { settingsStore } from '../store/settings/store'

export class CheckInstallationHandler implements EventHandler {
  private readonly logger = new Logger('CheckInstallationHandler')

  async listen(): Promise<BadError> {
    const hasGameExe = await this.checkGameExe()

    if (hasGameExe !== false) {
      return hasGameExe
    }

    const hasCompiler = await this.checkCompiler()

    if (hasCompiler !== false) {
      return hasCompiler
    }

    const gameType = settingsStore.get('game').type
    const file = toCompilerSourceFile(gameType)
    const isUsingMo2: boolean = settingsStore.get('mo2.use')

    if (isUsingMo2) {
      const hasMo2Instance = await this.checkMo2Instance()

      if (hasMo2Instance !== false) {
        return hasMo2Instance
      }
    }

    return isUsingMo2 ? this.checkInMo2(file) : this.checkInGameDataFolder(file)
  }

  private checkGameExe(): Promise<BadError> {
    this.logger.debug('checking game exe')

    const game = settingsStore.get('game')
    const gamePath = game.path
    const gameType = game.type
    const executable = toExecutable(gameType)

    const result: Promise<BadError> = Promise.resolve(
      path.exists(path.join(gamePath, executable)) ? false : 'game',
    )

    this.logger.debug('checking game exe - done')

    return result
  }

  private checkMo2Instance(): Promise<BadError> {
    this.logger.debug('checking mo2 instance')

    const mo2Use: boolean = settingsStore.get('mo2.use')
    const mo2Instance: string = settingsStore.get('mo2.instance')

    const result: Promise<BadError> = Promise.resolve(
      mo2Use ? (!path.exists(mo2Instance) ? 'mo2-instance' : false) : false,
    )

    this.logger.debug('checking mo2 instance - done')

    return result
  }

  private async checkInMo2(file: CompilerSourceFile): Promise<BadError> {
    const gameType: GameType = settingsStore.get('game.type')
    const mo2 = settingsStore.get('mo2')

    if (is.undefined(mo2.instance)) {
      return this.checkInGameDataFolder(file)
    }

    this.logger.info('checking in mo2 folder')

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
    const gamePath: string = settingsStore.get('game.path')
    const gameType: GameType = settingsStore.get('game.type')
    this.logger.debug('checking in game Data folder')

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

    this.logger.debug('checking in game Data folder - done')

    return Promise.resolve(false)
  }

  private checkCompiler(): Promise<BadError> {
    this.logger.debug('checking compiler path')

    const compilerPath: string = settingsStore.get('compilation.compilerPath')

    const result: Promise<BadError> = Promise.resolve(
      path.exists(path.normalize(compilerPath)) ? false : 'compiler',
    )

    this.logger.debug('checking compiler path - done')

    return result
  }
}
