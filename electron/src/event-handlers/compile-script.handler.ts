import { Injectable } from '@nestjs/common'
import { Handler } from '../decorators'
import GameHelper from '../helpers/game.helper'
import PathHelper from '../helpers/path.helper'
import { CompilerService } from '../services/compiler.service'
import { ConfigService } from '../services/config.service'
import log from 'electron-log'
import { GameType } from '../types/game.type'
import { HandlerInterface } from '../types/handler.interface'

interface CompileScriptParameters {
  script: string
  output: string
  gamePath: string
  game: GameType
  mo2Instance: string
  mo2SourcesFolders: string[]
}

@Injectable()
@Handler('compile-script')
export class CompileScriptHandler implements HandlerInterface<CompileScriptParameters> {
  constructor(
    private gameHelper: GameHelper,
    private pathHelper: PathHelper
  ) {}

  async listen(event: Electron.IpcMainEvent, { script, game, gamePath, mo2SourcesFolders, mo2Instance }: CompileScriptParameters) {
    const configService = ConfigService.create(this.pathHelper, this.gameHelper, { game, gamePath, mo2SourcesFolders, mo2Instance })
    const compileService = new CompilerService(configService, this.pathHelper)

    log.info('Started compilation for script:', script)

    try {
      const result = await compileService.compile(script)
      const isSuccess = /0 failed/.test(result)

      log.log('Compilation result\n\n', result, '\n')
      log.log('Compilation is success', isSuccess)

      if (isSuccess) {
        log.info(`Script ${script} sucessfully compiled.`)

        return result
      } else {
        this.throwError(script, { stderr: result })
      }
    } catch (err) {
      this.throwError(script, { stderr: err.message })
    }
  }

  private throwError(script: string, result: { stderr: string }) {
    throw new Error(`Script ${script} failed to compile: ${result.stderr}`)
  }
}
