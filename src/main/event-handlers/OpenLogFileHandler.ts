import { shell } from 'electron'
import Log from '../services/Log'
import { HandlerInterface } from '../HandlerInterface'

export class OpenLogFileHandler implements HandlerInterface {
  private readonly log = new Log('LogHandler')

  async listen(): Promise<void> {
    const logFile = this.log.transports.file.getFile()

    try {
      await shell.openExternal(logFile.path)
    } catch (e) {
      if (e.message.includes('Invalid URL')) {
        await shell.openExternal(`file://${logFile.path}`)
      } else {
        throw e
      }
    }
  }
}
