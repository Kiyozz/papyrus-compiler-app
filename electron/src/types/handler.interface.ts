import 'electron'

export interface HandlerInterface<T = any> {
  listen(event: Electron.IpcMainEvent, args?: T): any
}
