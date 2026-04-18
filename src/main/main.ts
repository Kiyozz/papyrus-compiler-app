/*
 * 2022-2026 Kiyozz.
 */
import { format } from 'url'
import { BrowserWindow, app } from 'electron'
import { is } from 'electron-util'
import { debugInfo, isDev } from 'electron-util/main'
import { version } from '../common/version'
import { Logger, applyLogLevel } from './logger'
import { dirname, join } from './path/path'
import { unhandled } from './unhandled'
import { dynamicActivateLocale } from './i18n.ts'
import { SettingsStore } from './store/settings/store'
import { MainBrowserWindow } from '#main/main-browser-window.ts'
import { container } from '#main/container.ts'
import { Initializer } from '#main/initialize.ts'
import { RpcChannel } from '#main/rpc-channel.ts'
import { MainApi } from '#main/main-api.ts'

const settingsStore = await container.make(SettingsStore)

applyLogLevel(settingsStore.get('logLevel'))

const _startLocale = settingsStore.get('locale')
await dynamicActivateLocale(_startLocale?.startsWith('fr') ? 'fr' : 'en')

const logger = new Logger('Main')
let win: BrowserWindow | null = null

unhandled(() => {
  logger.debug('win has been closed because of an error')
  win?.close()
  win = null
  process.exit(1)
})

async function createWindow() {
  logger.info(debugInfo())
  logger.info('public release: ', version)

  win = await container.make(MainBrowserWindow)

  const rpc = await container.make(RpcChannel)
  const mainApi = await container.make(MainApi)
  rpc.expose(mainApi.mainApi)

  if (isDev) {
    // noinspection ES6MissingAwait
    void win.loadURL('http://localhost:9080')
  } else {
    // noinspection ES6MissingAwait
    void win.loadURL(
      format({
        pathname: join(dirname(import.meta), 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  const initializer = await container.make(Initializer)

  await initializer.initialize()

  win.on('closed', () => {
    win = null
  })

  win.on('ready-to-show', () => {
    win?.show()

    if (isDev) {
      win?.webContents.openDevTools({ mode: 'bottom' })
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null && app.isReady()) {
    // noinspection JSIgnoredPromiseFromCall
    void createWindow()
  }
})
