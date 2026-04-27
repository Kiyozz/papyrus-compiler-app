/*
 * 2026 Kiyozz.
 */

import { inject } from '#main/inject.ts'
import type { MainAPI } from '#common/types/api.ts'
import { TelemetryHandler } from '#event-handlers/telemetry.handler.ts'
import { TelemetryActiveHandler } from '#event-handlers/telemetry-active.handler.ts'
import { GetVersionHandler } from '#event-handlers/get-version.handler.ts'
import { InAppErrorHandler } from '#event-handlers/in-app-error.handler.ts'
import { ClipboardCopyHandler } from '#event-handlers/clipboard-copy.handler.ts'
import { ConfigGetHandler } from '#event-handlers/config-get.handler.ts'
import { ConfigUpdateHandler } from '#event-handlers/config-update.handler.ts'
import { ConfigCheckHandler } from '#event-handlers/config-check.handler.ts'
import { IsProductionHandler } from '#event-handlers/is-production.handler.ts'
import { ScriptCompileEvent } from '#event-handlers/script-compile.event.ts'
import { DialogHandler } from '#event-handlers/dialog.handler.ts'
import { RecentFilesGetHandler } from '#event-handlers/recent-files-get.handler.ts'
import { RecentFilesSetHandler } from '#event-handlers/recent-files-set.handler.ts'
import { RecentFilesClearHandler } from '#event-handlers/recent-files-clear.handler.ts'
import { RecentFilesRemoveHandler } from '#event-handlers/recent-files-remove.handler.ts'
import { shell } from 'electron'
import { MainBrowserWindow } from '#main/main-browser-window.ts'
import { Logger } from '#main/logger.ts'
import { Platform } from '#main/platform.ts'
import { Telemetry } from '#main/telemetry/telemetry.ts'
import { MainMenu } from '#main/main-menu.ts'
import { ContextMenu } from '#main/context-menu.ts'

@inject()
export class MainApi {
  mainApi: MainAPI

  readonly #logger = new Logger('MainApi')
  readonly #mainMenu: MainMenu
  readonly #win: MainBrowserWindow
  readonly #contextMenu: ContextMenu

  constructor(
    win: MainBrowserWindow,
    platform: Platform,
    telemetry: Telemetry,
    mainMenu: MainMenu,
    contextMenu: ContextMenu,
    telemetryHandler: TelemetryHandler,
    telemetryActiveHandler: TelemetryActiveHandler,
    clipboardCopyHandler: ClipboardCopyHandler,
    configGetHandler: ConfigGetHandler,
    configUpdateHandler: ConfigUpdateHandler,
    configCheckHandler: ConfigCheckHandler,
    scriptCompileEvent: ScriptCompileEvent,
    recentFilesGetHandler: RecentFilesGetHandler,
    recentFilesSetHandler: RecentFilesSetHandler,
    recentFilesClearHandler: RecentFilesClearHandler,
    recentFilesRemoveHandler: RecentFilesRemoveHandler,
  ) {
    this.#win = win
    this.#mainMenu = mainMenu
    this.#contextMenu = contextMenu
    this.mainApi = {
      telemetry: {
        send: (event, args) =>
          telemetryHandler.listen({
            name: event,
            properties: args,
          }),
        setActive: async (active) => {
          telemetryActiveHandler.listen(active)
        },
      },
      getVersion: () => new GetVersionHandler().listen(),
      error: async (err) => {
        await new InAppErrorHandler(telemetry).listen(
          Object.assign(new Error(err.message), { stack: err.stack }),
        )
      },
      online: async (online) => {
        this.#logger.info(
          'network status changes.',
          `Internet is ${online ? 'online' : 'offline'}`,
        )
        telemetry.online = online
      },
      clipboard: {
        copy: (text) => clipboardCopyHandler.listen({ text }),
      },
      config: {
        get: () => configGetHandler.listen(),
        update: (partialConfig, override) => {
          return configUpdateHandler.listen({
            config: partialConfig,
            override,
          })
        },
        check: () => configCheckHandler.listen(),
      },
      isProduction: () => Promise.resolve(new IsProductionHandler().listen()),
      compilation: {
        start: async (script, onFinish) => {
          const result = await scriptCompileEvent.run(script)
          onFinish(result)
        },
      },
      dialog: {
        select: (type) => new DialogHandler().listen({ type }),
      },
      recentFiles: {
        get: () => recentFilesGetHandler.listen(),
        set: (scripts) => recentFilesSetHandler.listen(scripts),
        clear: () => {
          return recentFilesClearHandler.listen()
        },
        remove: (script) => recentFilesRemoveHandler.listen(script),
        dialog: {
          open: async () => {
            this.#contextMenu.openRecentFilesMenu?.()
          },
          close: async () => {
            this.#contextMenu.closeRecentFilesMenu?.()
          },
        },
      },
      shell: {
        openExternal: (href) => shell.openExternal(href),
      },
      titlebar: {
        openMenu: async (args) => {
          this.#mainMenu.menu?.popup({
            window: this.#win,
            ...args,
          })
        },
      },
      os: {
        platform: () => {
          return Promise.resolve(platform.current())
        },
      },
      window: {
        close: async () => {
          if (win.closable) {
            win.close()
          }
        },
        minimize: async () => {
          if (win.isMinimizable()) {
            win.minimize()
          }
        },
        maximize: async () => {
          if (win.isMaximizable()) {
            win.maximize()
          }
        },
        restore: async () => {
          win.restore()
        },
      },
    }
  }
}
