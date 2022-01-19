/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import {
  ipcMain as baseIpcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  ipcRenderer as baseIpcRenderer,
  IpcRendererEvent,
} from 'electron'

type MainInvokeListener<Args> = (event: IpcMainInvokeEvent, args: Args) => void
type MainListener<Args> = (event: IpcMainEvent, args: Args) => void

class IpcException extends Error {
  constructor(message: string) {
    super(
      message.replace(
        /Error invoking remote method ('.*'): Error: (.*)/,
        (s, event: string, errorMessage: string) => errorMessage,
      ),
    )
  }
}

class IpcRenderer {
  async invoke<Result = unknown>(
    channel: string,
    args?: unknown,
  ): Promise<Result> {
    try {
      return (await baseIpcRenderer.invoke(channel, args)) as Promise<Result>
    } catch (e) {
      if (e instanceof Error) {
        throw new IpcException(e.message)
      }

      throw e
    }
  }

  send<Params = unknown>(channel: string, ...args: Params[]): void {
    baseIpcRenderer.send(channel, ...(args ?? []))
  }

  // noinspection JSUnusedGlobalSymbols
  sendSync<Result = unknown, Params = unknown>(
    channel: string,
    ...args: Params[]
  ): Result {
    return baseIpcRenderer.sendSync(channel, ...(args ?? []))
  }

  once<Result = unknown>(
    channel: string,
    listener: (args: Result) => void,
  ): void {
    baseIpcRenderer.once(channel, (_, args: Result) => {
      listener(args)
    })
  }

  on<Result = unknown>(
    channel: string,
    listener: (e: Electron.IpcRendererEvent, args: Result) => void,
  ) {
    baseIpcRenderer.on(channel, listener)
  }

  removeListener<Result = unknown>(
    channel: string,
    listener: (e: IpcRendererEvent, args: Result) => void,
  ) {
    baseIpcRenderer.removeListener(channel, listener)
  }
}

class IpcMain {
  handle<Result = unknown>(
    channel: string,
    listener: MainInvokeListener<Result>,
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
