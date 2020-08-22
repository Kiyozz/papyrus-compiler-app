import { HandlerInvoke } from '../decorators'
import { toSource } from '../helpers/game.helper'
import { PathHelper } from '../helpers/path.helper'
import { LogService } from '../services/log.service'
import { GameType } from '../types/game.type'
import { HandlerInterface } from '../types/handler.interface'

interface GetFileParameters {
  file: string
  gamePath: string
  gameType: GameType
  isUsingMo2: boolean
  mo2Path: string
}

@HandlerInvoke('get-file')
export class GetFileHandler implements HandlerInterface<GetFileParameters> {
  constructor(private readonly logService: LogService, private readonly pathHelper: PathHelper) {}

  listen(event: Electron.IpcMainEvent, { file, gamePath, gameType, isUsingMo2, mo2Path }: GetFileParameters) {
    return isUsingMo2
      ? this.checksInMo2(file, gameType, gamePath, mo2Path)
      : this.checksInGameDataFolder(file, gamePath, gameType)
  }

  private async checksInMo2(file: string, gameType: GameType, gamePath: string, mo2Path: string): Promise<boolean> {
    this.logService.info('Checking in Mo2 folder')

    const sourcesFolder = toSource(gameType)
    const pathToChecks = [
      this.pathHelper.join(mo2Path, 'mods', '**', sourcesFolder, file),
      this.pathHelper.join(mo2Path, 'overwrite', '**', sourcesFolder, file)
    ]
      .map(folder => this.pathHelper.toSlash(folder))
      .map(folder => this.pathHelper.normalize(folder))

    this.logService.info('Checking that files', ...pathToChecks, 'exists')

    const files = await this.pathHelper.getPathsInFolder([...pathToChecks], { absolute: true, deep: 4 })

    this.logService.info('Found files: ', ...files)

    return files.length === 0 ? this.checksInGameDataFolder(file, gamePath, gameType) : true
  }

  private async checksInGameDataFolder(file: string, gamePath: string, gameType: GameType): Promise<boolean> {
    this.logService.info('Checking in Skyrim Data folder')

    const gameScriptsFolder = this.pathHelper.join(gamePath, 'data', toSource(gameType), file)

    this.logService.info('Checking that', this.pathHelper.normalize(gameScriptsFolder), 'exists')

    const result = await this.pathHelper.exists(this.pathHelper.normalize(gameScriptsFolder))

    this.logService.info('Found folder', result)

    return result
  }
}
