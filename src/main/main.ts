/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { format } from 'url'
import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { debugInfo, is } from 'electron-util'
import { join } from './services/path.service'
import { initialize } from './initialize'
import { Logger } from './logger'
import { createReportDialog } from './services/create-report-dialog.service'

const logger = new Logger('Main')
let win: BrowserWindow | null = null

async function createWindow() {
  logger.info(debugInfo())

  const windowOptions: BrowserWindowConstructorOptions = {
    width: 800,
    height: 820,
    minHeight: 600,
    minWidth: 700,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      enableRemoteModule: true,
      contextIsolation: false
    },
    show: false
  }

  if (is.macos) {
    windowOptions.titleBarStyle = 'hidden'
  } else {
    windowOptions.frame = false
  }

  win = new BrowserWindow(windowOptions)

  const isDev = is.development

  if (isDev) {
    win.loadURL('http://localhost:9080')
  } else {
    win.loadURL(
      format({
        pathname: join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  await initialize(win)

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('devtools-opened', () => {
    win!.focus()
    setImmediate(() => {
      win!.focus()
    })
  })

  win.on('ready-to-show', () => {
    logger.debug('the window is ready to show')

    win!.show()
    win!.focus()

    if (isDev) {
      win!.webContents.openDevTools({ mode: 'bottom' })
    }

    setImmediate(() => win!.focus())
  })

  logger.catchErrors({
    showDialog: false,
    onError(error, versions, submitIssue) {
      createReportDialog(error, versions, submitIssue)

      win?.close()
      win = null
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
    createWindow()
  }
})
