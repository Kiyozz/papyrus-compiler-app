import { Injectable } from '@nestjs/common'
import fs from 'fs-extra'
import fg from 'fast-glob'
import path from 'path'
import { Handler } from '../decorators'
import GameHelper from '../helpers/game.helper'
import PathHelper from '../helpers/path.helper'
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
      this.throwError('Missing parameters: mo2Instance or game')

      return
    }

    try {
      await fs.stat(path.resolve(mo2Instance, 'mods'))
    } catch (e) {
      this.throwError(`Folder "mods" does not exists in ${mo2Instance}`)

      return
    }

    const otherGameSourceFolder = this.gameHelper.toOtherSource(game)
    const foldersToCheck = [otherGameSourceFolder, sourcesFolderType].map(f => `${this.pathHelper.toSlash(mo2Instance)}/mods/**/${f}`)

    try {
      let files = await fg(foldersToCheck, { absolute: true, deep: 3, onlyDirectories: true })
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
      this.throwError(e)
    }
  }

  private throwError(err: Error | string) {
    if (typeof err === 'string') {
      err = new Error(err)
    }

    throw err
  }
}
