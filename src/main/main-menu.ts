/*
 * 2026 Kiyozz.
 */

import { app, Menu, type MenuItemConstructorOptions, shell } from 'electron'
import { MainBrowserWindow } from '#main/main-browser-window.ts'
import { inject } from '#main/inject.ts'
import { appMenu } from 'electron-util/main'
import { t } from '@lingui/core/macro'
import { SettingsStore } from '#main/store/settings/store.ts'
import { exists } from '#main/path/path.ts'
import { GITHUB_ISSUES_NEW_LINK } from '#main/constants.ts'
import { GITHUB_LINK } from '#common/constants.ts'
import is from '@sindresorhus/is'
import { match } from 'ts-pattern'
import createDefaultMenu from 'electron-default-menu'
import { Logger } from '#main/logger.ts'

import { is as isUtil, openUrlMenuItem } from 'electron-util'
import { dynamicActivateLocale } from '#main/i18n.ts'
import { RpcChannel } from '#main/rpc-channel.ts'

@inject()
export class MainMenu {
  menu: Menu | undefined

  #logger = new Logger('MainMenu')
  #win: MainBrowserWindow
  #rpc: RpcChannel
  #settingsStore: SettingsStore

  constructor(
    win: MainBrowserWindow,
    settingsStore: SettingsStore,
    rpc: RpcChannel,
  ) {
    this.#win = win
    this.#rpc = rpc
    this.#settingsStore = settingsStore
    this.#createMenu().then((menu) => (this.menu = menu))

    settingsStore.onDidChange('locale', async (locale) => {
      if (locale && ['fr', 'en'].some((l) => locale.startsWith(l))) {
        await dynamicActivateLocale(locale as 'fr' | 'en')
        this.menu = await this.#createMenu()
      }
    })
  }

  async #openFile(file: string): Promise<void> {
    this.#logger.debug('opening the file', file)

    try {
      await shell.openExternal(file)
    } catch (e) {
      if (e instanceof Error && e.message.includes('Invalid URL')) {
        await shell.openExternal(`file://${file}`)
      } else {
        throw e
      }
    }
  }

  async #createMenu(): Promise<Menu> {
    const rendererApi = this.#rpc.getAPI()

    const menu = appMenu([
      {
        label: t`Préférences...`,
        role: 'appMenu',
        submenu: [
          {
            label: t`Configuration...`,
            click: () => {
              this.#settingsStore.openInEditor()
            },
            accelerator: 'CommandOrControl+,',
          },
          {
            label: t`Réinitialiser`,
            click: () => {
              this.#settingsStore.resetSettings()
              rendererApi.config.onReset()
            },
          },
        ],
      },
      {
        label: t`Rechercher les mises à jour...`,
        click: () => {
          rendererApi.changelog.onUpdate(undefined)
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
          click: () => {
            void this.#openFile(this.#logger.file.path)
          },
        },
        {
          label: t`Session précédente...`,
          submenu: [
            {
              label: t`Rapports...`,
              click: () => {
                void this.#openFile(this.#logger.previousSessionFilePath)
              },
              enabled: exists(this.#logger.previousSessionFilePath),
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
            .with(
              'undo',
              'redo',
              'cut',
              'copy',
              'paste',
              'selectall',
              (role) => {
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
              },
            )
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

    this.#logger.debug('registering menu')

    const builtMenu = Menu.buildFromTemplate([menu, ...defaultMenus])

    if (isUtil.macos) {
      Menu.setApplicationMenu(builtMenu)
    } else {
      this.#win.setMenu(builtMenu)
    }

    return builtMenu
  }
}
