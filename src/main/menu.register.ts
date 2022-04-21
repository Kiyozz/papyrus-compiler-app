/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

// noinspection SpellCheckingInspection

import is from '@sindresorhus/is'
import { app, Menu, shell } from 'electron'
import createDefaultMenu from 'electron-default-menu'
import { is as isUtil, appMenu, openUrlMenuItem } from 'electron-util'
import { match } from 'ts-pattern'
import { GITHUB_LINK } from '../common/constants'
import { GITHUB_ISSUES_NEW_LINK } from './constants'
import { IpcEvent } from './ipc-event'
import { Logger } from './logger'
import { exists } from './path/path'
import { settingsStore, defaultConfig } from './store/settings/store'
import type { MenuItemConstructorOptions, BrowserWindow } from 'electron'

interface RegisterMenusCallbacks {
  openLogFile: (file: string) => Promise<void>
  win: BrowserWindow
}

const logger = new Logger('RegisterMenu')

export async function registerMenu({
  win,
  openLogFile,
}: RegisterMenusCallbacks): Promise<Menu> {
  const t = await (await import('./translations/index')).instance

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

            win.webContents.send(IpcEvent.configReset)
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

  menu.label = 'PCA'

  const fileMenu: MenuItemConstructorOptions = {
    label: t('appMenu.file.title'),
    role: 'fileMenu',
    submenu: [
      {
        label: t('appMenu.file.actions.logs'),
        click() {
          void openLogFile(logger.file.path)
        },
      },
      {
        label: t('appMenu.file.actions.previousLogs.title'),
        submenu: [
          {
            label: t('appMenu.file.actions.previousLogs.actions.logs'),
            click() {
              void openLogFile(logger.previousSessionFilePath)
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
        url: GITHUB_ISSUES_NEW_LINK,
      }),
      openUrlMenuItem({
        label: t('appMenu.help.actions.github'),
        url: GITHUB_LINK,
      }),
    ],
  }

  if (is.array(menu.submenu)) {
    for (const item of menu.submenu) {
      const label = match(item.role as string)
        .with('about', 'hide', 'quit', role => {
          const key = role === 'hide' ? 'hideSelf' : role

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
          return t<string>(`appMenu.app.${key}`, { app: 'PCA' })
        })
        .with('hideothers', 'unhide', role => {
          const key = role === 'hideothers' ? 'hideOthers' : 'showAll'

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
          return t<string>(`appMenu.app.${key}`)
        })
        .otherwise(() => undefined)

      if (!is.undefined(label)) {
        item.label = label
      }
    }
  }

  if (isUtil.windows || isUtil.linux) {
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

  const editMenu = defaultMenus.find(
    defaultMenu => defaultMenu.label === 'Edit',
  )
  const viewMenu = defaultMenus.find(
    defaultMenu => defaultMenu.label === 'View',
  )
  const windowMenu = defaultMenus.find(
    defaultMenu => defaultMenu.label === 'Window',
  )

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

  const builtMenu = Menu.buildFromTemplate([menu, ...defaultMenus])

  if (isUtil.macos) {
    Menu.setApplicationMenu(builtMenu)
  } else {
    win.setMenu(builtMenu)
  }

  return builtMenu
}
