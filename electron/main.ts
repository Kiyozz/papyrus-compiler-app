import { app, BrowserWindow } from 'electron'
import path from 'path'
import { Initialize } from './src/initialize'

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 820,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  })

  const mainUrl = process.env.REACT_APP_MAIN

  if (mainUrl) {
    win.loadURL(mainUrl)
  } else {
    win.loadFile(path.resolve(__dirname, 'index.html'))
  }

  if (mainUrl) {
    win.webContents.openDevTools({ mode: 'bottom' })
  }

  Initialize.main()

  win.on('closed', () => {
    win = null
  })

  win.on('ready-to-show', () => {
    win!.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
