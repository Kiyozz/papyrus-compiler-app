/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { shell } from 'electron'

import { BadError } from '../common/interfaces/bad-error'
import { Bridge } from '../common/interfaces/bridge'
import { CompilationResult } from '../common/interfaces/compilation-result'
import { Config } from '../common/interfaces/config'
import { ipcRenderer } from '../common/ipc'
import { Events } from './events'

const api: Bridge = {
  telemetry: {
    send: (event, args) =>
      ipcRenderer
        .invoke(Events.telemetry, { name: event, properties: args })
        .catch(e =>
          console.error(
            "can't send telemetry event to main process",
            e.message || e,
          ),
        ),
    active: active => ipcRenderer.invoke(Events.telemetryActive, active),
  },
  version: {
    get: () => ipcRenderer.invoke<string>(Events.getVersion),
  },
  changelog: {
    on: fn => ipcRenderer.on(Events.changelog, fn),
    off: fn => ipcRenderer.off(Events.changelog, fn),
  },
  error: e => ipcRenderer.invoke(Events.appError, e),
  online: online => ipcRenderer.send(Events.online, { online }),
  installation: {
    check: () => ipcRenderer.invoke<BadError>(Events.checkInstallation),
  },
  clipboard: {
    copy: text => ipcRenderer.invoke(Events.clipboardCopy, { text }),
  },
  config: {
    update: (partialConfig, override) =>
      ipcRenderer.invoke<Config>(Events.configUpdate, {
        config: partialConfig,
        override,
      }),
    get: () => ipcRenderer.invoke<Config>(Events.configGet),
  },
  isProduction: () => ipcRenderer.invoke<boolean>(Events.isProduction),
  compilation: {
    start: script => ipcRenderer.send(Events.compileScriptStart, script),
    onceFinish: (script, listener) =>
      ipcRenderer.once<CompilationResult>(
        `${Events.compileScriptFinish}-${script}`,
        listener,
      ),
  },
  dialog: {
    select: type =>
      ipcRenderer.invoke<string | null>(Events.openDialog, { type }),
  },
  shell: {
    openExternal: href => shell.openExternal(href),
  },
}

;(window as unknown as { bridge: Bridge }).bridge = api
