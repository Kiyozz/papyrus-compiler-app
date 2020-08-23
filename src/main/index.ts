import { app, BrowserWindow } from 'electron'
import { debugInfo, is } from 'electron-util'
import path from 'path'
import { format } from 'url'
import { initialize } from './initialize'
import Log from './services/Log'
import loadingHtmlFile from './loading.html'
import { createReportDialog } from './services/reportDialog'

const log = new Log('Main')
let win: BrowserWindow | null = null

function createWindow() {
  log.log(debugInfo())

  const loading = new BrowserWindow({ width: 300, backgroundColor: '#303030', height: 200, show: false, frame: false })

  loading.on('ready-to-show', () => {
    loading.show()
  })

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

  loading.loadURL(
    format({
      pathname: path.resolve(__dirname, loadingHtmlFile),
      protocol: 'file',
      slashes: true
    })
  )

  setTimeout(() => {
    if (isDev) {
      win!.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    } else {
      win!.loadURL(
        format({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file',
          slashes: true
        })
      )
    }

    initialize()

    win!.on('closed', () => {
      win = null
    })

    win!.webContents.on('devtools-opened', () => {
      win!.focus()
      setImmediate(() => {
        win!.focus()
      })
    })

    win!.on('ready-to-show', () => {
      loading.hide()
      loading.close()

      setTimeout(() => {
        win!.show()
        win!.focus()

        if (isDev) {
          win!.webContents.openDevTools({ mode: 'bottom' })
        }

        setImmediate(() => win!.focus())
      }, 300)
    })

    log.catchErrors({
      showDialog: false,
      onError(error, versions, submitIssue) {
        createReportDialog(error, versions, submitIssue)

        win?.close()
        win = null
      }
    })
  }, 1500)
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
