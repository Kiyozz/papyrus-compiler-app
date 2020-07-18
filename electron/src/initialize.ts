import { NestFactory } from '@nestjs/core'
import log from 'electron-log'
import fs from 'fs-extra'
import { AppModule } from './app.module'
import { EventHandlerParser } from './services/event-handler-parser'

export class Initialize {
  public static async main() {
    await Initialize.backupLatestLogFile()

    const app = await NestFactory.createApplicationContext(AppModule)
    const parser: EventHandlerParser = app.get<EventHandlerParser>(EventHandlerParser)

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
