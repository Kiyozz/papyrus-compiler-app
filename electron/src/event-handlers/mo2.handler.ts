import { Injectable } from '@nestjs/common'
import { Handler } from '../decorators'
import { InvalidMo2InstanceFolderException, InvalidMo2ConfigurationException, Mo2GetSourcesFoldersException } from '../exceptions'
import { GameHelper } from '../helpers/game.helper'
import { PathHelper } from '../helpers/path.helper'
import { GameType } from '../types/game.type'
import { HandlerInterface } from '../types/handler.interface'

interface Mo2SourcesFolderParameters {
  mo2Instance: string
  game: GameType
}

@Injectable()
@Handler('mo2-sources-folders')
export class Mo2Handler implements HandlerInterface {
  constructor(
    private readonly pathHelper: PathHelper,
    private readonly gameHelper: GameHelper
  ) {}

  async listen(event: Electron.IpcMainEvent, { mo2Instance, game }: Mo2SourcesFolderParameters) {
    const sourcesFolderType = game === 'Skyrim Special Edition' ? 'Source/Scripts' : 'Scripts/Source'

    if (!mo2Instance || !game) {
      throw new InvalidMo2ConfigurationException(['mo2Instance', 'game'])
    }

    try {
      await this.pathHelper.stat(this.pathHelper.join(mo2Instance, 'mods'))
      await this.pathHelper.stat(this.pathHelper.join(mo2Instance, 'profiles'))
      await this.pathHelper.stat(this.pathHelper.join(mo2Instance, 'downloads'))
    } catch (e) {
      throw new InvalidMo2InstanceFolderException(mo2Instance)
    }

    const otherGameSourceFolder = this.gameHelper.toOtherSource(game)
    const foldersToCheck = [otherGameSourceFolder, sourcesFolderType].map(f => `${mo2Instance}/mods/**/${f}`)

    try {
      let files = await this.pathHelper.getPathsInFolder(foldersToCheck, { absolute: true, deep: 3, onlyDirectories: true })
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

          return isSame && (new RegExp(sourcesFolderType)).test(file) ? file : before
        })
        .filter(f => !!f) as string[]

      files = files
        .filter((file) => {
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

      return files
    } catch (e) {
      throw new Mo2GetSourcesFoldersException(e.message)
    }
  }
}
