/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'
import createDefaultMenu from 'electron-default-menu'
import { appMenu, openUrlMenuItem } from 'electron-util'
import { appStore, defaultConfig } from '../common/store'
import * as Events from '../common/events'
import { Logger } from './logger'
import { exists } from './services/path.service'

interface RegisterMenusCallbacks {
  openLogFile: (file: string) => void
  win: Electron.BrowserWindow
}

const logger = new Logger('RegisterMenu')
const githubUrl = 'https://github.com/Kiyozz/papyrus-compiler-app'
const reportBugUrl = 'https://github.com/Kiyozz/papyrus-compiler-app/issues/new'

export function registerMenu({ win, openLogFile }: RegisterMenusCallbacks) {
  const menu = appMenu()

  const appSubmenu: MenuItemConstructorOptions[] = [
    {
      label: 'Preferences...',
      submenu: [
        {
          label: 'Open',
          click() {
            appStore.openInEditor()
          },
          accelerator: 'CommandOrControl+,'
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
    {
      label: 'Check for updates',
      click() {
        win.webContents.send(Events.Changelog)
      }
    }
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
      {
        label: 'Logs',
        click() {
          openLogFile(logger.file.path)
        },
        accelerator: 'CommandOrControl+Alt+J'
      },
      openUrlMenuItem({
        label: 'Report bug',
        url: reportBugUrl
      }),
      openUrlMenuItem({
        label: 'GitHub',
        url: githubUrl
      })
    ]
  }

  if (exists(logger.previousSessionFilePath)) {
    if (is.array(helpMenu.submenu)) {
      helpMenu.submenu.splice(-2, 0, {
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
