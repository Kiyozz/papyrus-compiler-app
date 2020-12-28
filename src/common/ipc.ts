/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import {
  ipcMain as baseIpcMain,
  IpcMainInvokeEvent,
  ipcRenderer as baseIpcRenderer
} from 'electron'

type MainInvokeListener<Args> = (event: IpcMainInvokeEvent, args: Args) => void

class IpcException extends Error {
  constructor(message: string) {
    super(
      message.replace(
        /Error invoking remote method ('.*'): Error: (.*)/,
        (s, event: string, errorMessage: string) => errorMessage
      )
    )
  }
}

class IpcRenderer {
  invoke<Result = any>(channel: string, args?: any): Promise<Result> {
    return (baseIpcRenderer.invoke(channel, args) as Promise<Result>).catch(
      e => {
        throw new IpcException(e.message)
      }
    )
  }
}

class IpcMain {
  handle<Result = any>(channel: string, listener: MainInvokeListener<Result>) {
    return baseIpcMain.handle(channel, listener)
  }
}

const ipcRenderer = new IpcRenderer()
const ipcMain = new IpcMain()

export { ipcRenderer, ipcMain }
