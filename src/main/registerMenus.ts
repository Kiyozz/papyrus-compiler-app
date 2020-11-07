import { EVENTS } from '@common'
import is from '@sindresorhus/is'
import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'
import { ipcMain as ipc } from 'electron-better-ipc'
import defaultMenu from 'electron-default-menu'
import { appMenu, openUrlMenuItem } from 'electron-util'
import Log from './services/Log'
import { exists } from './services/path'
import appStore, { defaultConfig } from '../common/appStore'

interface RegisterMenusCallbacks {
  openLogFile: (file: string) => void
}

const log = new Log('RegisterMenus')

export async function registerMenus({ openLogFile }: RegisterMenusCallbacks) {
  const nexusPath = process.env.APP_NEXUS_PATH ?? 'https://github.com/Kiyozz/papyrus-compiler-app'

  const menu = appMenu([
    {
      label: 'Preferences...',
      submenu: [
        {
          label: 'Configuration',
          click() {
            appStore.openInEditor()
          },
          accelerator: 'CommandOrControl+,'
        },
        {
          type: 'separator'
        },
        {
          label: 'Reset',
          click() {
            appStore.store = defaultConfig
            ipc.callFocusedRenderer(EVENTS.CONFIG_RESET)
          }
        }
      ]
    },
    openUrlMenuItem({
      label: 'Check for updates',
      url: nexusPath
    })
  ])

  const helpMenu: MenuItemConstructorOptions = {
    label: 'Help',
    submenu: [
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
