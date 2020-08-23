import is from '@sindresorhus/is'
import appStore from '../../common/appStore'
import { toSource, toSlash, getExecutable } from '@common'
import Log from '../services/Log'
import * as path from '../services/path'
import { HandlerInterface } from '../HandlerInterface'

export class BadInstallationHandler implements HandlerInterface {
  private readonly log = new Log('BadInstallationHandler')

  async listen() {
    const gamePath = appStore.get('gamePath')
    const gameType = appStore.get('gameType')
    const executable = getExecutable(gameType)

    if (!(await path.exists(path.join(gamePath, executable)))) {
      return false
    }

    const file = 'Actor.psc'
    const isUsingMo2: boolean = appStore.get('mo2.use')

    return isUsingMo2 ? this.checksInMo2(file) : this.checksInGameDataFolder(file)
  }

  private async checksInMo2(file: string): Promise<boolean> {
    const gameType = appStore.get('gameType')
    const mo2 = appStore.get('mo2')

    if (is.undefined(mo2.instance)) {
      return false
    }

    this.log.info('Checking in Mo2 folder')

    const sourcesFolder = toSource(gameType)
    const modsPath = path.join(mo2.instance, mo2.mods)
    const pathToChecks = [path.join(modsPath, '**', sourcesFolder, file), path.join(mo2.instance, 'overwrite', '**', sourcesFolder, file)]
      .map(folder => toSlash(folder))
      .map(folder => path.normalize(folder))

    this.log.info('Checking that files', ...pathToChecks, 'exists')

    const files = await path.getPathsInFolder([...pathToChecks], { absolute: true, deep: 4 })

    this.log.info('Found files: ', ...files)

    return files.length === 0 ? this.checksInGameDataFolder(file) : true
  }

  private async checksInGameDataFolder(file: string): Promise<boolean> {
    const gamePath = appStore.get('gamePath')
    const gameType = appStore.get('gameType')
    this.log.info('Checking in Skyrim Data folder')

    const gameScriptsFolder = path.join(gamePath, 'data', toSource(gameType), file)

    this.log.info('Checking that', path.normalize(gameScriptsFolder), 'exists')

    const result = await path.exists(path.normalize(gameScriptsFolder))

    this.log.debug('Found folder', result)

    return result
  }
}
