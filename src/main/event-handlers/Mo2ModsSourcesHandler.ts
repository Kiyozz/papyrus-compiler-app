import is from '@sindresorhus/is'
import appStore from '../../common/appStore'
import Mo2InvalidConfigurationException from '../exceptions/mo2/Mo2InvalidConfigurationException'
import Mo2InvalidInstanceException from '../exceptions/mo2/Mo2InvalidInstanceException'
import Mo2SourcesException from '../exceptions/mo2/Mo2SourcesException'
import { toOtherSource, toSource, toAntiSlash } from '@common'
import Log from '../services/Log'
import * as path from '../services/path'
import { HandlerInterface } from '../HandlerInterface'

export class Mo2ModsSourcesHandler implements HandlerInterface {
  private readonly log = new Log('Mo2Handler')

  async listen() {
    const gameType = appStore.get('gameType')
    const mo2 = appStore.get('mo2')
    const sourcesFolderType = toSource(gameType)

    this.log.info('[MO2]: sourcesFolder', sourcesFolderType)

    if (is.undefined(mo2.instance)) {
      this.log.info('[MO2] invalid configuration, no mo2Instance or game')

      throw new Mo2InvalidConfigurationException(['mo2Instance', 'game'])
    }

    try {
      for (const folder of ['mods', 'profiles', 'downloads']) {
        await path.stat(path.join(mo2.instance, folder))
      }
    } catch (e) {
      this.log.error('[MO2] Instance does not have "mods", "profiles", "downloads" folders')

      throw new Mo2InvalidInstanceException(mo2.instance)
    }

    const otherGameSourceFolder = toOtherSource(gameType)
    const foldersToCheck = [otherGameSourceFolder, sourcesFolderType].map(f => `${mo2.instance}/mods/**/${f}`)

    this.log.info('[MO2] Folders to check', foldersToCheck)

    try {
      let files: string[] = await path.getPathsInFolder(foldersToCheck, {
        absolute: true,
        deep: 3,
        onlyDirectories: true
      })
      const doubleSourceFolders = files
        .map((file, index, list) => {
          const before = list[index === 0 ? 1 : index - 1]

          if (!before) {
            return false
          }

          const sliced = file.slice(0, -15)
          const slicedBefore = before.slice(0, -15)
          const isSame = sliced === slicedBefore

          if (!isSame) {
            return false
          }

          return isSame && new RegExp(sourcesFolderType).test(file) ? file : before
        })
        .filter(f => !!f) as readonly string[]

      this.log.info('[MO2] DoubleSourceFolders', doubleSourceFolders)

      files = files
        .filter(file => {
          const sliced = file.slice(0, -15)
          const isInDouble = doubleSourceFolders.some(inFile => {
            const slicedIn = inFile.slice(0, -15)

            return sliced === slicedIn
          })

          if (!isInDouble) {
            return true
          }

          return doubleSourceFolders.includes(file)
        })
        .map(file => toAntiSlash(file))

      this.log.info('[MO2] Folders containing sources', files)

      files.sort()

      return files
    } catch (e) {
      throw new Mo2SourcesException(e.message)
    }
  }
}
