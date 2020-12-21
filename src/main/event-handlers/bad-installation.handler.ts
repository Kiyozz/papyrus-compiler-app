/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { appStore } from '../../common/store'
import { toSlash } from '../../common/slash'
import { getExecutable, toSource } from '../../common/game'
import { Logger } from '../logger'
import * as path from '../services/path.service'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'

export class BadInstallationHandler implements EventHandlerInterface {
  private readonly logger = new Logger(BadInstallationHandler.name)

  async listen() {
    const gamePath = appStore.get('gamePath')
    const gameType = appStore.get('gameType')
    const executable = getExecutable(gameType)

    if (!path.exists(path.join(gamePath, executable))) {
      return false
    }

    const file = 'Actor.psc'
    const isUsingMo2: boolean = appStore.get('mo2.use')

    return isUsingMo2
      ? this.checksInMo2(file)
      : this.checksInGameDataFolder(file)
  }

  private async checksInMo2(file: string): Promise<boolean> {
    const gameType = appStore.get('gameType')
    const mo2 = appStore.get('mo2')

    if (is.undefined(mo2.instance)) {
      return false
    }

    this.logger.info('checking in mo2 folder')

    const sourcesFolder = toSource(gameType)
    const modsPath = path.join(mo2.instance, mo2.mods)
    const pathToChecks = [
      path.join(modsPath, '**', sourcesFolder, file),
      path.join(mo2.instance, 'overwrite', '**', sourcesFolder, file)
    ].map(folder => path.normalize(toSlash(folder)))

    const files = await path.getPathsInFolder([...pathToChecks], {
      absolute: true,
      deep: 4
    })

    return files.length === 0 ? this.checksInGameDataFolder(file) : true
  }

  private async checksInGameDataFolder(file: string): Promise<boolean> {
    const gamePath = appStore.get('gamePath')
    const gameType = appStore.get('gameType')
    this.logger.debug('checking in Skyrim Data folder')

    const gameScriptsFolder = path.join(
      gamePath,
      'Data',
      toSource(gameType),
      file
    )

    const result = path.exists(path.normalize(gameScriptsFolder))

    this.logger.debug('folder found', result)

    return result
  }
}
