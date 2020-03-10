import { Injectable } from '@nestjs/common'
import fs from 'fs-extra'
import path from 'path'
import { Handler } from '../decorators'
import { GameHelper } from '../helpers/game.helper'
import { LogService } from '../services/log.service'
import { GameType } from '../types/game.type'
import { HandlerInterface } from '../types/handler.interface'

interface GetFileParameters {
  file: string
  gamePath: string
  gameType: GameType
}

@Injectable()
@Handler('get-file')
export class GetFileHandler implements HandlerInterface<GetFileParameters> {
  constructor(
    private readonly gameHelper: GameHelper,
    private readonly logService: LogService
  ) {}

  async listen(event: Electron.IpcMainEvent, { file, gamePath, gameType }: GetFileParameters) {
    const gameScriptsFolder = path.join(gamePath, 'data', this.gameHelper.toSource(gameType), file)

    this.logService.debug('Checking that', gameScriptsFolder, 'exists')

    return fs.pathExists(gameScriptsFolder)
  }
}
