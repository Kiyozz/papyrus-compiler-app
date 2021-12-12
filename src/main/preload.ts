/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { contextBridge, IpcRendererEvent, shell } from 'electron'

import { BadError } from '../common/interfaces/bad-error'
import { Bridge } from '../common/interfaces/bridge'
import { CompilationResult } from '../common/interfaces/compilation-result'
import { Config } from '../common/interfaces/config'
import { Disposable } from '../common/interfaces/disposable'
import { Script } from '../common/interfaces/script'
import { WindowState } from '../common/interfaces/window-state'
import { ipcRenderer } from './ipc'
import { IpcEvent } from './ipc-event'

const api: Bridge = {
  telemetry: {
    send: (event, args) => {
      return ipcRenderer
        .invoke(IpcEvent.telemetry, { name: event, properties: args })
        .catch(e =>
          console.error(
            "can't send telemetry event to main process",
            e.message || e,
          ),
        )
    },
    active: active => ipcRenderer.invoke(IpcEvent.telemetryActive, active),
  },
  version: {
    get: () => ipcRenderer.invoke<string>(IpcEvent.getVersion),
  },
  changelog: {
    on: fn => ipcRenderer.on(IpcEvent.checkForUpdates, fn),
    off: fn => ipcRenderer.removeListener(IpcEvent.checkForUpdates, fn),
  },
  error: e => ipcRenderer.invoke(IpcEvent.appError, e),
  online: online => ipcRenderer.send(IpcEvent.online, { online }),
  installation: {
    check: () => ipcRenderer.invoke<BadError>(IpcEvent.checkInstallation),
  },
  clipboard: {
    copy: text => ipcRenderer.invoke(IpcEvent.clipboardCopy, { text }),
  },
  config: {
    update: (partialConfig, override) => {
      return ipcRenderer.invoke<Config>(IpcEvent.configUpdate, {
        config: partialConfig,
        override,
      })
    },
    get: () => ipcRenderer.invoke<Config>(IpcEvent.configGet),
    onReset: cb => {
      ipcRenderer.on(IpcEvent.configReset, cb)

      return {
        dispose() {
          ipcRenderer.removeListener(IpcEvent.configReset, cb)
        },
      }
    },
  },
  isProduction: () => ipcRenderer.invoke<boolean>(IpcEvent.isProduction),
  compilation: {
    start: script => ipcRenderer.send(IpcEvent.compileScriptStart, script),
    onceFinish: (script, listener) => {
      return ipcRenderer.once<CompilationResult>(
        `${IpcEvent.compileScriptFinish}-${script}`,
        listener,
      )
    },
  },
  dialog: {
    select: type => {
      return ipcRenderer.invoke<string | null>(IpcEvent.openDialog, {
        type,
      })
    },
  },
  shell: {
    openExternal: href => shell.openExternal(href),
  },
  recentFiles: {
    get: () => ipcRenderer.invoke<Script[]>(IpcEvent.recentFilesGet),
    set: scripts => {
      return ipcRenderer.invoke<Script[]>(IpcEvent.recentFilesSet, scripts)
    },
    clear: () => ipcRenderer.invoke(IpcEvent.recentFilesClear),
    remove: script => ipcRenderer.invoke(IpcEvent.recentFileRemove, script),
    select: {
      onAll: cb => {
        ipcRenderer.on(IpcEvent.recentFilesSelectAll, cb)

        return {
          dispose() {
            ipcRenderer.removeListener(IpcEvent.recentFilesSelectAll, cb)
          },
        }
      },
      onNone: cb => {
        ipcRenderer.on(IpcEvent.recentFilesSelectNone, cb)

        return {
          dispose() {
            ipcRenderer.removeListener(IpcEvent.recentFilesSelectNone, cb)
          },
        }
      },
      onInvertSelection: cb => {
        ipcRenderer.on(IpcEvent.recentFilesInvertSelection, cb)

        return {
          dispose() {
            ipcRenderer.removeListener(IpcEvent.recentFilesInvertSelection, cb)
          },
        }
      },
      onClear: cb => {
        ipcRenderer.on(IpcEvent.recentFilesOnClear, cb)

        return {
          dispose() {
            ipcRenderer.removeListener(IpcEvent.recentFilesOnClear, cb)
          },
        }
      },
    },
    dialog: {
      open: () => ipcRenderer.send(IpcEvent.recentFilesDialogOpen),
      close: () => ipcRenderer.send(IpcEvent.recentFilesDialogClose),
    },
  },
  titlebar: {
    openMenu: args => ipcRenderer.invoke(IpcEvent.openMenu, args),
  },
  os: {
    platform: () => ipcRenderer.sendSync(IpcEvent.platform),
  },
  window: {
    close: () => ipcRenderer.invoke(IpcEvent.windowClose),
    minimize: () => ipcRenderer.invoke(IpcEvent.windowMinimize),
    maximize: () => ipcRenderer.invoke(IpcEvent.windowMaximize),
    restore: () => ipcRenderer.invoke(IpcEvent.windowRestore),
    onStateChange: (cb: (state: WindowState) => void): Disposable => {
      const handler = (e: IpcRendererEvent, args: WindowState) => {
        cb(args)
      }

      ipcRenderer.on(IpcEvent.windowStateChange, handler)

      return {
        dispose() {
          return ipcRenderer.removeListener(IpcEvent.windowStateChange, handler)
        },
      }
    },
  },
}

contextBridge.exposeInMainWorld('bridge', api)
