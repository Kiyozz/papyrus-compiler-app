/*
 * 2026 Kiyozz.
 */
import { Container } from '@adonisjs/fold'
import {
  createSettingsStore,
  SettingsStore,
} from '#main/store/settings/store.ts'
import { MainBrowserWindow } from '#main/main-browser-window.ts'
import { createWindowStore, WindowStore } from '#main/store/window/store.ts'
import { type BrowserWindowConstructorOptions, ipcMain } from 'electron'
import { isDev } from 'electron-util/main'
import { dirname, join } from '#main/path/path.ts'
import isType from '@sindresorhus/is'
import { is } from 'electron-util'
import { EventEmitter } from '#main/event-emitter.ts'
import { electronIpcTransport } from 'kkrpc/electron'
import { RpcChannel } from '#main/rpc-channel.ts'
import { RecentFilesStore } from '#main/store/recent-files/store.ts'
import Emittery from 'emittery'
import { PapyrusCompilerService } from '#main/compilation/compile.ts'
import { Compiler } from '#main/compilation/compiler.ts'

const emitter = new Emittery()

const container = new Container({ emitter })

container.singleton(RecentFilesStore, () => new RecentFilesStore())
container.singleton(SettingsStore, () => createSettingsStore())
container.singleton(WindowStore, () => createWindowStore())
container.singleton(MainBrowserWindow, () => {
  const windowStore = createWindowStore()
  const { x, y } = windowStore.store

  const windowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: isDev ? 1020 : 820,
    minHeight: 600,
    minWidth: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(dirname(import.meta), 'preload.js'),
    },
    x: isType.null(x) ? undefined : x,
    y: isType.null(y) ? undefined : y,
    show: false,
  }

  if (is.macos) {
    windowOptions.titleBarStyle = 'hiddenInset'
  } else {
    windowOptions.autoHideMenuBar = true
    windowOptions.frame = false
  }

  return new MainBrowserWindow(windowOptions)
})
container.swap(Compiler, (resolver) => {
  return resolver.make(PapyrusCompilerService)
})
container.singleton(EventEmitter, () => new EventEmitter())
container.singleton(RpcChannel, async (resolver) => {
  const win = await resolver.make(MainBrowserWindow)
  const transport = electronIpcTransport({
    endpoint: {
      send: (channel, message) => {
        if (!win.webContents.isDestroyed()) {
          win.webContents.send(channel, message)
        }
      },
      on: (channel, listener) => {
        ipcMain.on(channel, listener)
      },
      off: (channel, listener) => {
        ipcMain.off(channel, listener)
      },
    },
  })
  return new RpcChannel(transport)
})

export { container }
