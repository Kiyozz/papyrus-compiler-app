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

export async function registerMenu({
  win,
  openLogFile,
}: RegisterMenusCallbacks): Promise<void> {
  const t = await (await import('./translations/index')).default()

  const menu = appMenu([
    {
      label: t('appMenu.app.preferences.title'),
      role: 'appMenu',
      submenu: [
        {
          label: t('appMenu.app.preferences.actions.open'),
          click() {
            settingsStore.openInEditor()
          },
          accelerator: 'CommandOrControl+,',
        },
        {
          label: t('appMenu.app.preferences.actions.reset'),
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
      label: t('appMenu.app.checkForUpdates'),
      click() {
        win.webContents.send(IpcEvent.changelog)
      },
    },
  ])

  const fileMenu: MenuItemConstructorOptions = {
    label: t('appMenu.file.title'),
    role: 'fileMenu',
    submenu: [
      {
        label: t('appMenu.file.actions.logs'),
        click() {
          openLogFile(logger.file.path)
        },
      },
      {
        label: t('appMenu.file.actions.previousLogs.title'),
        submenu: [
          {
            label: t('appMenu.file.actions.previousLogs.actions.logs'),
            click() {
              openLogFile(logger.previousSessionFilePath)
            },
            enabled: exists(logger.previousSessionFilePath),
          },
        ],
      },
    ],
  }

  const helpMenu: MenuItemConstructorOptions = {
    label: t('appMenu.help.title'),
    role: 'help',
    submenu: [
      openUrlMenuItem({
        label: t('appMenu.help.actions.report'),
        url: reportBugUrl,
      }),
      openUrlMenuItem({
        label: t('appMenu.help.actions.github'),
        url: githubUrl,
      }),
    ],
  }

  if (is.array(menu.submenu)) {
    for (const item of menu.submenu) {
      switch (item.role as string) {
        case 'about':
          item.label = t('appMenu.app.about', { app: 'PCA' })
          break
        case 'hide':
          item.label = t('appMenu.app.hideSelf', { app: 'PCA' })
          break
        case 'hideothers':
          item.label = t('appMenu.app.hideOthers')
          break
        case 'quit':
          item.label = t('appMenu.app.quit', { app: 'PCA' })
          break
        case 'unhide':
          item.label = t('appMenu.app.showAll')
          break
      }
    }
  }

  const defaultMenus = createDefaultMenu(app, shell)

  defaultMenus.shift() // Remove default app menu
  defaultMenus.pop() // Remove default help menu
  defaultMenus.push(helpMenu)
  defaultMenus.unshift(fileMenu)

  const editMenu = defaultMenus[1]
  const viewMenu = defaultMenus[2]
  const windowMenu = defaultMenus[3]

  if (!is.nullOrUndefined(editMenu)) {
    editMenu.role = 'editMenu'
    editMenu.label = t('appMenu.edit.title')

    if (is.array(editMenu.submenu)) {
      for (const item of editMenu.submenu) {
        switch (item.role as string) {
          case 'undo':
            item.label = t('appMenu.edit.actions.undo')
            break
          case 'redo':
            item.label = t('appMenu.edit.actions.redo')
            break
          case 'cut':
            item.label = t('appMenu.edit.actions.cut')
            break
          case 'copy':
            item.label = t('appMenu.edit.actions.copy')
            break
          case 'paste':
            item.label = t('appMenu.edit.actions.paste')
            break
          case 'selectall':
            item.label = t('appMenu.edit.actions.selectAll')
            break
        }
      }
    }
  }

  if (!is.nullOrUndefined(viewMenu)) {
    viewMenu.role = 'viewMenu'
    viewMenu.label = t('appMenu.view.title')

    if (is.array(viewMenu.submenu)) {
      const reloadAction = viewMenu.submenu[0]
      const fullScreenAction = viewMenu.submenu[1]
      const devToolsAction = viewMenu.submenu[2]

      if (!is.nullOrUndefined(reloadAction)) {
        reloadAction.label = t('appMenu.view.actions.reload')
      }

      if (!is.nullOrUndefined(fullScreenAction)) {
        fullScreenAction.label = t('appMenu.view.actions.fullScreen')
      }

      viewMenu.submenu.splice(2, 0, { type: 'separator' })

      if (!is.nullOrUndefined(devToolsAction)) {
        devToolsAction.label = t('appMenu.view.actions.devTools')
      }
    }
  }

  if (!is.nullOrUndefined(windowMenu)) {
    windowMenu.label = t('appMenu.window.title')

    if (is.array(windowMenu.submenu)) {
      windowMenu.submenu.forEach((item, index) => {
        switch (item.role) {
          case 'minimize':
            item.label = t('appMenu.window.actions.minimize')
            break
          default:
            if (item.label === 'Close') {
              ;(windowMenu.submenu as MenuItemConstructorOptions[]).splice(
                index,
                0,
                { type: 'separator' },
              )

              item.label = t('appMenu.window.actions.close')
            }
        }
      })
    }
  }

  logger.debug('registering menu')

  Menu.setApplicationMenu(Menu.buildFromTemplate([menu, ...defaultMenus]))
}
