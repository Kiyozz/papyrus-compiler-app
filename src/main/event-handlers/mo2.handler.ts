import { Handler } from '../decorators'
import {
  InvalidMo2InstanceFolderException,
  InvalidMo2ConfigurationException,
  Mo2GetSourcesFoldersException
} from '../exceptions'
import { toOtherSource } from '../helpers/game.helper'
import { PathHelper } from '../helpers/path.helper'
import { GameType } from '../types/game.type'
import { HandlerInterface } from '../types/handler.interface'
import { LogService } from '../services/log.service'

interface Mo2SourcesFolderParameters {
  mo2Instance: string
  game: GameType
}

@Handler('mo2-sources-folders')
export class Mo2Handler implements HandlerInterface {
  constructor(private readonly pathHelper: PathHelper, private readonly logService: LogService) {}

  async listen(event: Electron.IpcMainEvent, { mo2Instance, game }: Mo2SourcesFolderParameters) {
    const sourcesFolderType = game === 'Skyrim Special Edition' ? 'Source/Scripts' : 'Scripts/Source'

    this.logService.info('[MO2]: sourcesFolder', sourcesFolderType)

    if (!mo2Instance || !game) {
      this.logService.info('[MO2] invalid configuration, no mo2Instance or game')

      throw new InvalidMo2ConfigurationException(['mo2Instance', 'game'])
    }

    try {
      for (const folder of ['mods', 'profiles', 'downloads']) {
        await this.pathHelper.stat(this.pathHelper.join(mo2Instance, folder))
      }
    } catch (e) {
      this.logService.error('[MO2] Instance does not have "mods", "profiles", "downloads" folders')

      throw new InvalidMo2InstanceFolderException(mo2Instance)
    }

    const otherGameSourceFolder = toOtherSource(game)
    const foldersToCheck = [otherGameSourceFolder, sourcesFolderType].map(f => `${mo2Instance}/mods/**/${f}`)

    this.logService.info('[MO2] Folders to check', foldersToCheck)

    try {
      let files: readonly string[] = await this.pathHelper.getPathsInFolder(foldersToCheck, {
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

      this.logService.info('[MO2] DoubleSourceFolders', doubleSourceFolders)

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
        .map(file => this.pathHelper.toAntiSlash(file))

      this.logService.info('[MO2] Folders containing sources', files)

      return files
    } catch (e) {
      throw new Mo2GetSourcesFoldersException(e.message)
    }
  }
}
