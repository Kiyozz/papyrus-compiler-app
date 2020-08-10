import log from 'electron-log'
import fs from 'fs-extra'
import { CompileScriptHandler } from './event-handlers/compile-script.handler'
import { DialogHandler } from './event-handlers/dialog.handler'
import { GetFileHandler } from './event-handlers/file.handler'
import { LogHandler } from './event-handlers/log.handler'
import { Mo2Handler } from './event-handlers/mo2.handler'
import { GameHelper } from './helpers/game.helper'
import { PathHelper } from './helpers/path.helper'
import { EventHandlerParser } from './services/event-handler-parser'
import { LogService } from './services/log.service'
import { Mo2Service } from './services/mo2.service'
import { PapyrusCompilerService } from './services/papyrus-compiler.service'
import { ShellService } from './services/shell.service'

export class Initialize {
  public static async main() {
    await Initialize.backupLatestLogFile()

    const logService = new LogService()
    const gameHelper = new GameHelper()
    const pathHelper = new PathHelper(logService)
    const shellService = new ShellService(logService)
    const papyrusCompilerService = new PapyrusCompilerService()
    const mo2Service = new Mo2Service(pathHelper, gameHelper)

    const parser = new EventHandlerParser(
      [
        new CompileScriptHandler(gameHelper, pathHelper, shellService, papyrusCompilerService, mo2Service, logService),
        new LogHandler(),
        new Mo2Handler(pathHelper, gameHelper)
      ],
      [new GetFileHandler(gameHelper, logService, pathHelper), new DialogHandler()],
      logService
    )

    parser.register()
  }

  private static async backupLatestLogFile() {
    const logFile = log.transports.file.getFile().path

    if (!logFile) {
      return
    }

    await fs.ensureFile(logFile)
    await fs.copy(logFile, `${logFile.replace('.log', '')}.1.log`)
  }
}
