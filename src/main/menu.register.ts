/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'
import createDefaultMenu from 'electron-default-menu'
import { appMenu, openUrlMenuItem } from 'electron-util'

import { IpcEvent } from './ipc-event'
import { Logger } from './logger'
import { exists } from './path/path'
import { settingsStore, defaultConfig } from './store/settings/store'

interface RegisterMenusCallbacks {
  openLogFile: (file: string) => void
  win: Electron.BrowserWindow
}

const logger = new Logger('RegisterMenu')
const githubUrl = 'https://github.com/Kiyozz/papyrus-compiler-app'
const reportBugUrl = 'https://github.com/Kiyozz/papyrus-compiler-app/issues/new'

export function registerMenu({
  win,
  openLogFile,
}: RegisterMenusCallbacks): void {
  const menu = appMenu()

  menu.submenu = [
    {
      label: 'Preferences...',
      submenu: [
        {
          label: 'Open',
          click() {
            settingsStore.openInEditor()
          },
          accelerator: 'CommandOrControl+,',
        },
        {
          label: 'Reset',
          click() {
            settingsStore.store = {
              ...defaultConfig,
              tutorials: {
                ...defaultConfig.tutorials,
                settings: false,
                telemetry: false,
              },
            }
          },
        },
      ],
    },
    {
      label: 'Check for updates',
      click() {
        win.webContents.send(IpcEvent.changelog)
      },
    },
  ]

  const helpMenu: MenuItemConstructorOptions = {
    label: 'Help',
    submenu: [
      {
        label: 'Logs',
        click() {
          openLogFile(logger.file.path)
        },
        accelerator: 'CommandOrControl+Alt+J',
      },
      openUrlMenuItem({
        label: 'Report bug',
        url: reportBugUrl,
      }),
      openUrlMenuItem({
        label: 'GitHub',
        url: githubUrl,
      }),
    ],
  }

  if (exists(logger.previousSessionFilePath)) {
    if (is.array(helpMenu.submenu)) {
      helpMenu.submenu.splice(-2, 0, {
        label: 'Previous session logs',
        click() {
          openLogFile(logger.previousSessionFilePath)
        },
        accelerator: 'CommandOrControl+Alt+Shift+J',
      })
    }
  }

  const defaultMenus = createDefaultMenu(app, shell)

  defaultMenus.shift() // Remove default app menu
  defaultMenus.pop() // Remove default help menu
  defaultMenus.push(helpMenu)

  const windowMenuIndex = defaultMenus.findIndex(
    defaultMenu => defaultMenu.label === 'Window',
  )

  if (windowMenuIndex !== -1) {
    defaultMenus.splice(windowMenuIndex, 1)
  }

  logger.debug('registering menu')

  Menu.setApplicationMenu(Menu.buildFromTemplate([menu, ...defaultMenus]))
}
