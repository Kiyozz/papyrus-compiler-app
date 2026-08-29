/*
 * 2022-2026 Kiyozz.
 */

import { Logger } from './logger'
import { ensureFiles, move, writeFile } from './path/path'
import { WindowStore } from './store/window/store'
import { publicVersion } from '#common/version.ts'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import { MainBrowserWindow } from '#main/main-browser-window.ts'
import { RpcChannel } from '#main/rpc-channel.ts'
import { SettingsStore } from '#main/store/settings/store.ts'
import { Telemetry } from '#main/telemetry/telemetry.ts'
import { GetVersionHandler } from '#event-handlers/get-version.handler.ts'
import { inject } from '#main/inject.ts'

const logger = new Logger('Initialize')

@inject()
export class Initializer {
  #win: MainBrowserWindow
  #rpc: RpcChannel
  #settingsStore: SettingsStore
  #windowStore: WindowStore
  #telemetry: Telemetry

  constructor(
    win: MainBrowserWindow,
    rpc: RpcChannel,
    settingsStore: SettingsStore,
    windowStore: WindowStore,
    telemetry: Telemetry,
  ) {
    this.#win = win
    this.#rpc = rpc
    this.#settingsStore = settingsStore
    this.#windowStore = windowStore
    this.#telemetry = telemetry
  }

  async initialize() {
    await this.#backupLogFile()

    // do not block the initialization on a network call
    void this.#sendFirstLoaded()

    const rendererApi = this.#rpc.getAPI()

    this.#win.on(
      'minimize',
      () => void rendererApi.window.onStateChange('minimized'),
    )
    this.#win.on(
      'enter-full-screen',
      () => void rendererApi.window.onStateChange('maximized'),
    )
    this.#win.on(
      'leave-full-screen',
      () => void rendererApi.window.onStateChange('normal'),
    )
    this.#win.on(
      'maximize',
      () => void rendererApi.window.onStateChange('maximized'),
    )
    this.#win.on(
      'unmaximize',
      () => void rendererApi.window.onStateChange('normal'),
    )

    logger.debug(this.#settingsStore.path)

    this.#win.on('moved', async () => {
      const [x, y] = this.#win.getPosition()

      this.#windowStore.set({ x, y })
    })
  }

  async #sendFirstLoaded() {
    if (!this.#settingsStore.firstLaunch) {
      return
    }

    logger.info('first launch of the app')

    const version = await new GetVersionHandler().listen()

    try {
      await this.#telemetry.event({
        name: TelemetryEvent.appFirstLoaded,
        properties: { version, publicVersion },
      })
    } catch {
      logger.debug("can't send the first launch telemetry event")
    }
  }

  async #backupLogFile() {
    const logFile = logger.file.path

    if (!logFile) {
      logger.info('there is no log file')

      return
    }

    await ensureFiles([logFile])

    const logFilename = logFile.replace('.log', '')

    await move(logFile, `${logFilename}.1.log`)
    await writeFile(logFile, '', { encoding: 'utf8' })

    logger.info(`file ${logFilename}.1.log created`)
  }
}
