import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'
import defaultMenu from 'electron-default-menu'
import { appMenu, openUrlMenuItem } from 'electron-util'

interface RegisterMenusCallbacks {
  openLogFile: () => void
}

export function registerMenus({ openLogFile }: RegisterMenusCallbacks) {
  const menu = appMenu()

  const helpMenu: MenuItemConstructorOptions = {
    label: 'Help',
    submenu: [
      openUrlMenuItem({
        label: 'Show in Nexusmods',
        url: process.env.APP_NEXUS_PATH ?? 'https://github.com/Kiyozz/papyrus-compiler-app'
      }),
      openUrlMenuItem({
        label: 'Report bug',
        url: 'https://github.com/Kiyozz/papyrus-compiler-app/issues/new'
      }),
      {
        label: 'Logs',
        click() {
          openLogFile()
        },
        accelerator: 'CommandOrControl+Alt+J'
      }
    ]
  }

  let defaultMenus = defaultMenu(app, shell).filter((m, i) => i !== 0)

  defaultMenus = defaultMenus.map((m, i) => {
    if (i === defaultMenus.length - 1) {
      return helpMenu
    }

    return m
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate([menu, ...defaultMenus]))
}
