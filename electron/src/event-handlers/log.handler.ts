import { Handler } from '../decorators'
import { HandlerInterface } from '../types/handler.interface'
import { shell } from 'electron'
import log from 'electron-log'

@Handler('log-file')
export class LogHandler implements HandlerInterface {
  async listen(event: Electron.IpcMainEvent, args?: any): Promise<void> {
    const logFile = log.transports.file.getFile()

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
