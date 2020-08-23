import { EVENTS } from '@common'
import is from '@sindresorhus/is'
import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'
import { ipcMain as ipc } from 'electron-better-ipc'
import defaultMenu from 'electron-default-menu'
import { appMenu, openUrlMenuItem } from 'electron-util'
import Log from './services/Log'
import { exists } from './services/path'
import appStore from '../common/appStore'

interface RegisterMenusCallbacks {
  openLogFile: (file: string) => void
}

const log = new Log('RegisterMenus')

export async function registerMenus({ openLogFile }: RegisterMenusCallbacks) {
  const menu = appMenu([
    {
      label: 'Configuration',
      submenu: [
        {
          label: 'Reset configuration',
          click() {
            appStore.reset()
            ipc.callFocusedRenderer(EVENTS.CONFIG_RESET)
          }
        },
        {
          label: 'Open configuration',
          click() {
            appStore.openInEditor()
          }
        }
      ]
    }
  ])

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
          openLogFile(log.file.path)
        },
        accelerator: 'CommandOrControl+Alt+J'
      }
    ]
  }

  if (await exists(log.previousSessionFilePath)) {
    if (is.array(helpMenu.submenu)) {
      helpMenu.submenu.push({
        label: 'Previous session logs',
        click() {
          openLogFile(log.previousSessionFilePath)
        },
        accelerator: 'CommandOrControl+Alt+Shift+J'
      })
    }
  }

  let defaultMenus = defaultMenu(app, shell).filter((m, i) => i !== 0)

  defaultMenus = defaultMenus.map((m, i) => {
    if (i === defaultMenus.length - 1) {
      return helpMenu
    }

    return m
  })

  log.log('Registering app menus')

  Menu.setApplicationMenu(Menu.buildFromTemplate([menu, ...defaultMenus]))
}
