import { app, Menu, MenuItemConstructorOptions } from 'electron'

interface RegisterMenusCallbacks {
  openLogFile: () => void
}

const SEPARATOR = (): MenuItemConstructorOptions => ({ type: 'separator' })

const defaultMenu: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [{ role: 'quit' }]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      SEPARATOR(),
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CommandOrControl+R',
        click: () => {
          app?.relaunch()
          app?.exit(0)
        }
      },
      {
        label: 'Force reload',
        accelerator: 'CommandOrControl+Shift+R',
        click: () => {
          app?.relaunch()
          app?.exit(0)
        }
      },
      { role: 'toggleDevTools' },
      SEPARATOR(),
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }]
  }
]

export function registerMenus({ openLogFile }: RegisterMenusCallbacks) {
  const menu = Menu.buildFromTemplate([
    ...defaultMenu,
    {
      label: 'Actions',
      submenu: [
        {
          label: 'Open log file',
          click: () => openLogFile(),
          accelerator: 'CommandOrControl+Alt+J'
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)
}
