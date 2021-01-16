/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'
import createDefaultMenu from 'electron-default-menu'
import { appMenu, openUrlMenuItem } from 'electron-util'
import { appStore, defaultConfig } from '../common/store'
import { Logger } from './logger'
import { exists } from './services/path.service'

interface RegisterMenusCallbacks {
  openLogFile: (file: string) => void
}

const logger = new Logger('RegisterMenu')
const githubUrl = 'https://github.com/Kiyozz/papyrus-compiler-app'

export function registerMenu({ openLogFile }: RegisterMenusCallbacks) {
  const nexusPath = process.env.ELECTRON_WEBPACK_APP_MOD_URL ?? githubUrl

  const menu = appMenu()

  const appSubmenu: MenuItemConstructorOptions[] = [
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
            appStore.store = {
              ...defaultConfig,
              tutorials: {
                ...defaultConfig.tutorials,
                settings: false
              }
            }
          }
        }
      ]
    },
    openUrlMenuItem({
      label: 'Check for updates',
      url: nexusPath
    }),
    openUrlMenuItem({
      label: 'GitHub',
      url: githubUrl
    })
  ]

  const usedAppMenu = (menu.submenu as MenuItemConstructorOptions[]).filter(
    submenu => submenu.role === 'quit' || submenu.role === 'about'
  ) as [MenuItemConstructorOptions, MenuItemConstructorOptions]

  menu.submenu = [
    usedAppMenu[0],
    { type: 'separator' },
    ...appSubmenu,
    { type: 'separator' },
    usedAppMenu[1]
  ]

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
          openLogFile(logger.file.path)
        },
        accelerator: 'CommandOrControl+Alt+J'
      }
    ]
  }

  if (exists(logger.previousSessionFilePath)) {
    if (is.array(helpMenu.submenu)) {
      helpMenu.submenu.push({
        label: 'Previous session logs',
        click() {
          openLogFile(logger.previousSessionFilePath)
        },
        accelerator: 'CommandOrControl+Alt+Shift+J'
      })
    }
  }

  const defaultMenus = createDefaultMenu(app, shell)

  defaultMenus.shift() // Remove default app menu
  defaultMenus.pop() // Remove default help menu
  defaultMenus.push(helpMenu)

  const windowMenuIndex = defaultMenus.findIndex(
    defaultMenu => defaultMenu.label === 'Window'
  )

  if (windowMenuIndex !== -1) {
    defaultMenus.splice(windowMenuIndex, 1)
  }

  logger.debug('registering menu')

  Menu.setApplicationMenu(Menu.buildFromTemplate([menu, ...defaultMenus]))
}
