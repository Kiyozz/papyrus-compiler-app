/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { format } from 'url'
import isType from '@sindresorhus/is'
import { app, BrowserWindow, Menu } from 'electron'
import { debugInfo, is } from 'electron-util'
import { version } from '../common/version'
import { initialize } from './initialize'
import { Logger } from './logger'
import { join } from './path/path'
import { createWindowStore } from './store/window/store'
import { unhandled } from './unhandled'
import type {
  BrowserWindowConstructorOptions,
  MenuItemConstructorOptions,
} from 'electron'

const logger = new Logger('Main')
let win: BrowserWindow | null = null
let startingWin: BrowserWindow | null = null

unhandled(() => {
  logger.debug('win has been closed because of an error')
  win?.close()
  win = null
})

async function createWindow() {
  logger.info(debugInfo())
  logger.info('public release: ', version)

  const isDev = is.development

  const windowStore = createWindowStore()
  const { x, y } = windowStore.store

  const windowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: 820,
    minHeight: 600,
    minWidth: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
    },
    x: isType.null_(x) ? undefined : x,
    y: isType.null_(y) ? undefined : y,
    show: false,
  }

  if (is.macos) {
    windowOptions.titleBarStyle = 'hiddenInset'
  } else {
    windowOptions.autoHideMenuBar = true
    windowOptions.frame = false
  }

  const tm = setTimeout(() => {
    startingWin = new BrowserWindow({
      width: 400,
      height: 400,
      frame: false,
      x: isType.null_(x) ? undefined : x,
      y: isType.null_(y) ? undefined : y,
    })

    const startingWinTemplate: MenuItemConstructorOptions[] = []

    if (isDev) {
      startingWinTemplate.push({
        role: 'toggleDevTools',
      })
    }

    startingWin.setMenu(Menu.buildFromTemplate(startingWinTemplate))

    void startingWin.loadURL(
      format({
        pathname: join(__dirname, 'browser-windows', 'starting.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }, 1000)

  win = new BrowserWindow(windowOptions)

  if (isDev) {
    // noinspection ES6MissingAwait
    void win.loadURL('http://localhost:9080')
  } else {
    // noinspection ES6MissingAwait
    void win.loadURL(
      format({
        pathname: join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  await initialize(win, windowStore)

  win.on('closed', () => {
    win = null
  })

  win.on('ready-to-show', () => {
    clearTimeout(tm)

    startingWin?.close()
    startingWin?.destroy()
    startingWin = null

    setTimeout(() => {
      win?.show()

      if (isDev) {
        win?.webContents.openDevTools({ mode: 'bottom' })
      }
    }, 100)
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
