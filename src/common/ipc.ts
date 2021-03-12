/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import {
  ipcMain as baseIpcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  ipcRenderer as baseIpcRenderer
} from 'electron'

type MainInvokeListener<Args> = (event: IpcMainInvokeEvent, args: Args) => void
type MainListener<Args> = (event: IpcMainEvent, args: Args) => void

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
  invoke<Result = unknown>(channel: string, args?: unknown): Promise<Result> {
    return (baseIpcRenderer.invoke(channel, args) as Promise<Result>).catch(
      e => {
        throw new IpcException(e.message)
      }
    )
  }

  send<Params = unknown>(channel: string, ...args: Params[]): void {
    baseIpcRenderer.send(channel, ...(args ?? []))
  }

  once<Result = unknown>(
    channel: string,
    listener: (args: Result) => void
  ): void {
    baseIpcRenderer.once(channel, (_, args: Result) => {
      listener(args)
    })
  }

  on<Result = unknown>(channel: string, listener: (args: Result) => void) {
    baseIpcRenderer.on(channel, (_, args: Result) => {
      listener(args)
    })
  }

  off(channel: string, listener: (args: unknown) => void) {
    baseIpcRenderer.off(channel, listener)
  }
}

class IpcMain {
  handle<Result = unknown>(
    channel: string,
    listener: MainInvokeListener<Result>
  ) {
    return baseIpcMain.handle(channel, listener)
  }

  on<Args = unknown>(channel: string, listener: MainListener<Args>) {
    baseIpcMain.on(channel, listener)
  }
}

const ipcRenderer = new IpcRenderer()
const ipcMain = new IpcMain()

export { ipcRenderer, ipcMain }
