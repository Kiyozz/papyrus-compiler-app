import { Injectable } from '@nestjs/common'
import { Handler } from '../decorators'
import { HandlerInterface } from '../types/handler.interface'
import { shell } from 'electron'
import log from 'electron-log'

@Handler('log-file')
@Injectable()
export class LogHandler implements HandlerInterface {
  listen(event: Electron.IpcMainEvent, args?: any): any {
    const logFile = log.transports.file.getFile()

    return shell.openExternal(logFile.path)
  }
}
