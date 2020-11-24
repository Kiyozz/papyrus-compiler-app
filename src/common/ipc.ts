/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ipcMain as baseIpcMain, IpcMainInvokeEvent, ipcRenderer as baseIpcRenderer } from 'electron'

type MainInvokeListener<Args> = (event: IpcMainInvokeEvent, args: Args) => void

class IpcRenderer {
  invoke<Result = any>(channel: string, args?: any): Promise<Result> {
    return baseIpcRenderer.invoke(channel, args) as Promise<Result>
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
