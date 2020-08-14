import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

export interface HandlerInterface<T = any> {
  listen(event: IpcMainEvent, args?: T): any
}

export interface HandlerInvokeInterface<T = any> {
  listen(event: IpcMainInvokeEvent, args?: T): any
}
