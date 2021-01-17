/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { appStore } from '../../common/store'
import { toSlash } from '../../common/slash'
import {
  GameType,
  toExecutable,
  toOtherSource,
  toSource
} from '../../common/game'
import { Logger } from '../logger'
import * as path from '../services/path.service'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { BadErrorType } from '../../common/interfaces/bad-error.type'

export class BadInstallationHandler implements EventHandlerInterface {
  private readonly logger = new Logger('BadInstallationHandler')

  async listen(): Promise<BadErrorType> {
    const hasGameExe = await this.checkGameExe()

    if (hasGameExe !== false) {
      return hasGameExe
    }

    const hasCompiler = await this.checkCompiler()

    if (hasCompiler !== false) {
      return hasCompiler
    }

    const file = 'Actor.psc'
    const isUsingMo2: boolean = appStore.get('mo2.use')

    if (isUsingMo2) {
      const hasMo2Instance = await this.checkMo2Instance()

      if (hasMo2Instance !== false) {
        return hasMo2Instance
      }
    }

    return isUsingMo2 ? this.checkInMo2(file) : this.checkInGameDataFolder(file)
  }

  private checkGameExe(): Promise<BadErrorType> {
    this.logger.debug('checking game exe')

    const game = appStore.get('game')
    const gamePath = game.path
    const gameType = game.type
    const executable = toExecutable(gameType)

    return Promise.resolve(
      path.exists(path.join(gamePath, executable)) ? false : 'game'
    )
  }

  private checkMo2Instance(): Promise<BadErrorType> {
    const mo2Use: boolean = appStore.get('mo2.use')
    const mo2Instance: string = appStore.get('mo2.instance')

    return Promise.resolve(
      mo2Use ? (!path.exists(mo2Instance) ? 'mo2-instance' : false) : false
    )
  }

  private async checkInMo2(file: string): Promise<BadErrorType> {
    const gameType: GameType = appStore.get('game.type')
    const mo2 = appStore.get('mo2')

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
      path.join(mo2.instance, 'overwrite', otherSourcesFolder, file)
    ].map(folder => path.normalize(toSlash(folder)))

    const files = await path.getPathsInFolder([...pathToChecks], {
      absolute: true,
      deep: 4
    })

    return files.length === 0 ? this.checkInGameDataFolder(file) : false
  }

  private checkInGameDataFolder(file: string): Promise<BadErrorType> {
    const gamePath: string = appStore.get('game.path')
    const gameType: GameType = appStore.get('game.type')
    this.logger.debug('checking in game Data folder')

    const gameScriptsFolder = path.join(
      gamePath,
      'Data',
      toSource(gameType),
      file
    )

    const result = path.exists(path.normalize(gameScriptsFolder))

    if (!result) {
      const otherGameScriptsFolder = path.join(
        gamePath,
        'Data',
        toOtherSource(gameType),
        file
      )

      const otherResult = path.exists(path.normalize(otherGameScriptsFolder))

      if (otherResult) {
        return Promise.resolve(false)
      }

      return Promise.resolve('scripts')
    }

    return Promise.resolve(false)
  }

  private checkCompiler(): Promise<BadErrorType> {
    this.logger.debug('checking compiler path')

    const compilerPath: string = appStore.get('compilation.compilerPath')

    return Promise.resolve(
      path.exists(path.normalize(compilerPath)) ? false : 'compiler'
    )
  }
}
