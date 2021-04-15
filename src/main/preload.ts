/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Titlebar } from 'custom-electron-titlebar'
import { contextBridge, Menu, shell } from 'electron'

import { BadError } from '../common/interfaces/bad-error'
import { Bridge } from '../common/interfaces/bridge'
import { CompilationResult } from '../common/interfaces/compilation-result'
import { Config } from '../common/interfaces/config'
import { ipcRenderer } from '../common/ipc'
import {
  darkColor,
  darkColorUnfocus,
  lightColor,
  lightColorUnfocus
} from '../renderer/utils/color'
import { isDark } from '../renderer/utils/dark'
import { Events } from './events'

let titlebar: Titlebar | null = null

const api: Bridge = {
  telemetry: {
    send: (event, args) =>
      ipcRenderer
        .invoke(Events.Telemetry, { name: event, properties: args })
        .catch(e =>
          console.error(
            "can't send telemetry event to main process",
            e.message || e
          )
        ),
    active: active => ipcRenderer.invoke(Events.TelemetryActive, active)
  },
  version: {
    get: () => ipcRenderer.invoke<string>(Events.GetVersion)
  },
  changelog: {
    on: fn => ipcRenderer.on(Events.Changelog, fn),
    off: fn => ipcRenderer.off(Events.Changelog, fn)
  },
  error: e => ipcRenderer.invoke(Events.AppError, e),
  online: online => ipcRenderer.send(Events.Online, { online }),
  installation: {
    check: () => ipcRenderer.invoke<BadError>(Events.CheckInstallation)
  },
  clipboard: {
    copy: text => ipcRenderer.invoke(Events.ClipboardCopy, { text })
  },
  config: {
    update: (partialConfig, override) =>
      ipcRenderer.invoke<Config>(Events.ConfigUpdate, {
        config: partialConfig,
        override
      }),
    get: () => ipcRenderer.invoke<Config>(Events.ConfigGet)
  },
  isProduction: () => ipcRenderer.invoke<boolean>(Events.IsProduction),
  compilation: {
    start: script => ipcRenderer.send(Events.CompileScriptStart, script),
    onceFinish: (script, listener) =>
      ipcRenderer.once<CompilationResult>(
        `${Events.CompileScriptFinish}-${script}`,
        listener
      )
  },
  dialog: {
    select: type =>
      ipcRenderer.invoke<string | null>(Events.OpenDialog, { type })
  },
  titlebar: {
    instance: () =>
      (titlebar ??= new Titlebar({
        backgroundColor: isDark() ? darkColor : lightColor,
        // icon: appIcon,
        unfocusEffect: false,
        menu: Menu.getApplicationMenu()
      })),
    colors: {
      darkColor,
      darkColorUnfocus,
      lightColor,
      lightColorUnfocus
    },
    updateBackground: bg => titlebar?.updateBackground(bg),
    updateTitle: title => titlebar?.updateTitle(title)
  },
  shell: {
    openExternal: href => shell.openExternal(href)
  }
}

contextBridge.exposeInMainWorld('bridge', api)
