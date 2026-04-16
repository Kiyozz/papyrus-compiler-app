/*
 * 2022-2026 Kiyozz.
 */

// noinspection SpellCheckingInspection

import is from '@sindresorhus/is'
import { app, Menu, shell } from 'electron'
import createDefaultMenu from 'electron-default-menu'
import { appMenu } from 'electron-util/main'
import { is as isUtil, openUrlMenuItem } from 'electron-util'
import { match } from 'ts-pattern'
import { GITHUB_LINK } from '../common/constants'
import { GITHUB_ISSUES_NEW_LINK } from './constants'
import { IpcEvent } from './ipc-event'
import { Logger } from './logger'
import { exists } from './path/path'
import { settingsStore, defaultConfig } from './store/settings/store'
import type { MenuItemConstructorOptions, BrowserWindow } from 'electron'
import { t } from '@lingui/core/macro'

interface RegisterMenusCallbacks {
  openLogFile: (file: string) => Promise<void>
  win: BrowserWindow
}

const logger = new Logger('RegisterMenu')

export async function registerMenu({
  win,
  openLogFile,
}: RegisterMenusCallbacks): Promise<Menu> {
  const menu = appMenu([
    {
      label: t`Préférences...`,
      role: 'appMenu',
      submenu: [
        {
          label: t`Configuration...`,
          click() {
            settingsStore.openInEditor()
          },
          accelerator: 'CommandOrControl+,',
        },
        {
          label: t`Réinitialiser`,
          click() {
            settingsStore.store = {
              ...defaultConfig,
            }

            win.webContents.send(IpcEvent.configReset)
          },
        },
      ],
    },
    {
      label: t`Rechercher les mises à jour...`,
      click() {
        win.webContents.send(IpcEvent.checkForUpdates)
      },
    },
  ])

  menu.label = 'PCA'

  const fileMenu: MenuItemConstructorOptions = {
    label: t`Fichier`,
    role: 'fileMenu',
    submenu: [
      {
        label: t`Rapports...`,
        click() {
          void openLogFile(logger.file.path)
        },
      },
      {
        label: t`Session précédente...`,
        submenu: [
          {
            label: t`Rapports...`,
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
    label: t`Aide`,
    role: 'help',
    submenu: [
      openUrlMenuItem({
        label: t`Signaler un bug...`,
        url: GITHUB_ISSUES_NEW_LINK,
      }),
      openUrlMenuItem({
        label: t`Github...`,
        url: GITHUB_LINK,
      }),
    ],
  }

  if (is.array(menu.submenu)) {
    for (const item of menu.submenu) {
      const label = match(item.role as string)
        .with('about', 'hide', 'quit', (role) => {
          if (role === 'about') {
            return t`À propos de PCA`
          }

          if (role === 'hide') {
            return t`Masquer PCA`
          }

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
          return t`Quitter PCA`
        })
        .with('hideothers', 'unhide', (role) => {
          if (role === 'hideothers') {
            return t`Masquer les autres`
          }

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
          return t`Montrer PCA`
        })
        .otherwise(() => undefined)

      if (!is.undefined(label)) {
        item.label = label
      }
    }
  }

  if (isUtil.windows || isUtil.linux) {
    if (is.array(menu.submenu)) {
      menu.submenu = menu.submenu.filter((item) => {
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
    (defaultMenu) => defaultMenu.label === 'Edit',
  )
  const viewMenu = defaultMenus.find(
    (defaultMenu) => defaultMenu.label === 'View',
  )
  const windowMenu = defaultMenus.find(
    (defaultMenu) => defaultMenu.label === 'Window',
  )

  if (!is.nullOrUndefined(editMenu)) {
    editMenu.role = 'editMenu'
    editMenu.label = t`Édition`

    if (is.array(editMenu.submenu)) {
      for (const item of editMenu.submenu) {
        const label = match<string, string | undefined>(item.role as string)
          .with('undo', 'redo', 'cut', 'copy', 'paste', 'selectall', (role) => {
            switch (role) {
              case 'undo':
                return t`Annuler`
              case 'redo':
                return t`Rétablir`
              case 'cut':
                return t`Couper`
              case 'copy':
                return t`Copier`
              case 'paste':
                return t`Coller`
              case 'selectall':
                return t`Sélectionner tout`
              default:
                return undefined
            }
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
    viewMenu.label = t`Présentation`

    if (is.array(viewMenu.submenu)) {
      const reloadAction = viewMenu.submenu[0]
      const fullScreenAction = viewMenu.submenu[1]
      const devToolsAction = viewMenu.submenu[2]

      if (!is.nullOrUndefined(reloadAction)) {
        reloadAction.label = t`Recharger`
      }

      if (!is.nullOrUndefined(fullScreenAction)) {
        fullScreenAction.label = t`Activer le mode plein écran`
      }

      viewMenu.submenu.splice(2, 0, { type: 'separator' })

      if (!is.nullOrUndefined(devToolsAction)) {
        devToolsAction.label = t`Outils de développement`
      }
    }
  }

  if (!is.nullOrUndefined(windowMenu)) {
    windowMenu.label = t`Fenêtre`

    if (is.array(windowMenu.submenu)) {
      windowMenu.submenu.forEach((item, index) => {
        switch (item.role) {
          case 'minimize':
            item.label = t`Réduire`
            break
          default:
            if (item.label === 'Close') {
              ;(windowMenu.submenu as MenuItemConstructorOptions[]).splice(
                index,
                0,
                { type: 'separator' },
              )

              item.label = t`Fermer`
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
