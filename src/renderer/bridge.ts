/*
 * 2022-2026 Kiyozz.
 */

import type { webUtils as electronWebUtils } from 'electron'
import { ElectronIpcRendererIO, RPCChannel } from 'kkrpc/electron-ipc'
import { fromError } from '../common/from-error'
import type { Bridge } from '../common/types/bridge'
import type { Disposable } from '../common/types/disposable'
import type { WindowState } from '../common/types/window-state'
import type { MainAPI, RendererAPI } from '../common/types/api'

// Push-event listener stores
const changelogListeners = new Set<(info: unknown) => void>()
const configResetListeners = new Set<() => void>()
const windowStateListeners = new Set<(state: WindowState) => void>()
const recentFilesSelectAllListeners = new Set<() => void>()
const recentFilesSelectNoneListeners = new Set<() => void>()
const recentFilesInvertSelectionListeners = new Set<() => void>()
const recentFilesOnClearListeners = new Set<() => void>()

const rendererApi: RendererAPI = {
  changelog: {
    onUpdate: async (info) => {
      changelogListeners.forEach((fn) => fn(info))
    },
  },
  config: {
    onReset: async () => {
      configResetListeners.forEach((fn) => fn())
    },
  },
  recentFiles: {
    selectAll: async () => {
      recentFilesSelectAllListeners.forEach((fn) => fn())
    },
    selectNone: async () => {
      recentFilesSelectNoneListeners.forEach((fn) => fn())
    },
    invertSelection: async () => {
      recentFilesInvertSelectionListeners.forEach((fn) => fn())
    },
    onClear: async () => {
      recentFilesOnClearListeners.forEach((fn) => fn())
    },
  },
  window: {
    onStateChange: async (state) => {
      windowStateListeners.forEach((fn) => fn(state))
    },
  },
}

const io = new ElectronIpcRendererIO()
const rpc = new RPCChannel<RendererAPI, MainAPI>(io, { expose: rendererApi })
const mainApi = rpc.getAPI()

export const bridge: Bridge = {
  telemetry: {
    send: async (event, args) => {
      try {
        return await mainApi.telemetry.send(event, args)
      } catch (e) {
        const err = fromError(e)
        console.error("can't send telemetry event to main process", err.message)
      }
    },
    setActive: (active) => mainApi.telemetry.setActive(active),
  },
  getVersion: () => mainApi.getVersion(),
  changelog: {
    on: (fn) => {
      changelogListeners.add(fn)
    },
    off: (fn) => {
      changelogListeners.delete(fn)
    },
  },
  error: (err) =>
    mainApi.error({ name: err.name, message: err.message, stack: err.stack }),
  online: (online) => void mainApi.online(online),
  clipboard: {
    copy: (text) => mainApi.clipboard.copy(text),
  },
  config: {
    update: (partialConfig, override) =>
      mainApi.config.update(partialConfig, override),
    get: () => mainApi.config.get(),
    onReset: (cb) => {
      configResetListeners.add(cb)
      return {
        dispose() {
          configResetListeners.delete(cb)
        },
      }
    },
    check: () => mainApi.config.check(),
  },
  isProduction: () => mainApi.isProduction(),
  compilation: {
    start: (script, onFinish) => mainApi.compilation.start(script, onFinish),
  },
  dialog: {
    select: (type) => mainApi.dialog.select(type),
  },
  shell: {
    openExternal: (href) => mainApi.shell.openExternal(href),
  },
  recentFiles: {
    get: () => mainApi.recentFiles.get(),
    set: (scripts) => mainApi.recentFiles.set(scripts),
    clear: () => mainApi.recentFiles.clear(),
    remove: (script) => mainApi.recentFiles.remove(script),
    select: {
      onAll: (cb) => {
        recentFilesSelectAllListeners.add(cb)
        return {
          dispose() {
            recentFilesSelectAllListeners.delete(cb)
          },
        }
      },
      onNone: (cb) => {
        recentFilesSelectNoneListeners.add(cb)
        return {
          dispose() {
            recentFilesSelectNoneListeners.delete(cb)
          },
        }
      },
      onInvertSelection: (cb) => {
        recentFilesInvertSelectionListeners.add(cb)
        return {
          dispose() {
            recentFilesInvertSelectionListeners.delete(cb)
          },
        }
      },
      onClear: (cb) => {
        recentFilesOnClearListeners.add(cb)
        return {
          dispose() {
            recentFilesOnClearListeners.delete(cb)
          },
        }
      },
    },
    dialog: {
      open: () => mainApi.recentFiles.dialog.open(),
      close: () => mainApi.recentFiles.dialog.close(),
    },
  },
  titlebar: {
    openMenu: (args) => mainApi.titlebar.openMenu(args),
  },
  os: {
    platform: () => mainApi.os.platform(),
  },
  window: {
    close: () => mainApi.window.close(),
    minimize: () => mainApi.window.minimize(),
    maximize: () => mainApi.window.maximize(),
    restore: () => mainApi.window.restore(),
    onStateChange: (cb: (state: WindowState) => void): Disposable => {
      windowStateListeners.add(cb)
      return {
        dispose() {
          windowStateListeners.delete(cb)
        },
      }
    },
  },
}

export const webUtils = (
  window.electron as unknown as { webUtils: typeof electronWebUtils }
).webUtils
