/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { app, Menu, MenuItemConstructorOptions, shell } from 'electron'
import createDefaultMenu from 'electron-default-menu'
import { appMenu, openUrlMenuItem, is as isPlatform } from 'electron-util'
import { match } from 'ts-pattern'

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
          label: t('appMenu.app.preferences.actions.configuration'),
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
        win.webContents.send(IpcEvent.checkForUpdates)
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
      const label = match<string, string | undefined>(item.role as string)
        .with('about', 'hide', 'quit', role => {
          const key = role === 'hide' ? 'hideSelf' : role

          return t(`appMenu.app.${key}`, { app: 'PCA' })
        })
        .with('hideothers', 'unhide', role => {
          const key = role === 'hideothers' ? 'hideOthers' : 'showAll'

          return t(`appMenu.app.${key}`)
        })
        .otherwise(() => undefined)

      if (label !== undefined) {
        item.label = label
      }
    }
  }

  if (isPlatform.windows || isPlatform.linux) {
    if (is.array(menu.submenu)) {
      menu.submenu = menu.submenu.filter(item => {
        return !['services', 'hide', 'unhide', 'hideothers'].includes(
          item.role as string,
        )
      })
    }
  }

  const defaultMenus = createDefaultMenu(app, shell)

  defaultMenus.shift() // Remove default app menu
  defaultMenus.pop() // Remove default help menu
  defaultMenus.push(helpMenu)
  defaultMenus.unshift(fileMenu)

  const editMenu = defaultMenus.find(menu => menu.label === 'Edit')
  const viewMenu = defaultMenus.find(menu => menu.label === 'View')
  const windowMenu = defaultMenus.find(menu => menu.label === 'Window')

  if (!is.nullOrUndefined(editMenu)) {
    editMenu.role = 'editMenu'
    editMenu.label = t('appMenu.edit.title')

    if (is.array(editMenu.submenu)) {
      for (const item of editMenu.submenu) {
        const label = match<string, string | undefined>(item.role as string)
          .with('undo', 'redo', 'cut', 'copy', 'paste', 'selectall', role => {
            const usedRole = role === 'selectall' ? 'selectAll' : role

            return t(`appMenu.edit.actions.${usedRole}`)
          })
          .otherwise(() => undefined)

        if (label !== undefined) {
          item.label = label
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
