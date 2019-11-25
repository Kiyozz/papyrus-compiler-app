import log from 'electron-log'
import fs from 'fs-extra'
import { CompileScriptHandler } from './event-handlers/compile-script.handler'
import { Mo2Handler } from './event-handlers/mo2.handler'
import { EventHandlerParser } from './services/event-handler-parser'

export class Initialize {
  public static main() {
    Initialize.backupLatestLogFile()
    Initialize.registerEventHandlers()
  }

  private static registerEventHandlers() {
    const handlers = [
      CompileScriptHandler,
      Mo2Handler
    ]
    const parser = new EventHandlerParser(handlers)

    parser.register()
  }

  private static async backupLatestLogFile() {
    const logFile = log.transports.file.findLogPath()

    if (!logFile) {
      return
    }

    await fs.rename(logFile, `${logFile.replace('.log', '')}.1.log`)
  }
}
