/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Menu,
  MenuItemConstructorOptions,
} from 'electron'
import { debugInfo, is } from 'electron-util'
import { format } from 'url'

import { initialize } from './initialize'
import { Logger } from './logger'
import { join } from './path/path'
import { unhandled } from './unhandled'

const logger = new Logger('Main')
let win: BrowserWindow | null = null
let startingWin: BrowserWindow | null = null

unhandled(() => {
  win?.close()
  win = null
})

async function createWindow() {
  logger.info(debugInfo())

  const isDev = is.development

  const windowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: 820,
    minHeight: 600,
    minWidth: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
    },
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
    })

    const startingWinTemplate: MenuItemConstructorOptions[] = []

    if (isDev) {
      startingWinTemplate.push({
        role: 'toggleDevTools',
      })
    }

    startingWin.setMenu(Menu.buildFromTemplate(startingWinTemplate))

    startingWin?.loadURL(
      format({
        pathname: join(__dirname, 'browser-windows', 'starting.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }, 800)

  win = new BrowserWindow(windowOptions)

  if (isDev) {
    // noinspection ES6MissingAwait
    win.loadURL('http://localhost:9080')
  } else {
    // noinspection ES6MissingAwait
    win.loadURL(
      format({
        pathname: join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    )
  }

  await initialize(win)

  win.on('closed', () => {
    win = null
  })

  win.on('ready-to-show', () => {
    logger.debug('the window is ready to show')
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
    createWindow()
  }
})
