import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import path from 'path'
import { initialize } from './initialize'
import { registerMenus } from './register-menus'
import { debugInfo, is } from 'electron-util'
import { format } from 'url'

let win: BrowserWindow | null = null

function createWindow() {
  log.log(debugInfo())

  win = new BrowserWindow({
    width: 800,
    height: 820,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    },
    show: false
  })

  const isDev = is.development

  if (isDev) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    win.loadURL(
      format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  initialize()

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
    win!.show()
    win!.focus()

    if (isDev) {
      win!.webContents.openDevTools({ mode: 'bottom' })
    }

    setImmediate(() => win!.focus())
  })

  registerMenus({
    openLogFile: () => {
      win?.webContents.send('open-log-file')
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
  if (win === null) {
    createWindow()
  }
})
