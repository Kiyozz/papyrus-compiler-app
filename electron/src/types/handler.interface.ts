import { IpcMainEvent } from 'electron'

export interface HandlerInterface<T = any> {
  listen(event: IpcMainEvent, args?: T): any
}
