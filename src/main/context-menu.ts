/*
 * 2026 Kiyozz.
 */

import { MainBrowserWindow } from '#main/main-browser-window.ts'
import { inject } from '#main/inject.ts'
import type { MenuItemConstructorOptions } from 'electron'
import { t } from '@lingui/core/macro'
import contextMenu from 'electron-context-menu'
import { RpcChannel } from '#main/rpc-channel.ts'

@inject()
export class ContextMenu {
  readonly #win: MainBrowserWindow
  readonly #rpc: RpcChannel

  openRecentFilesMenu: (() => void) | undefined
  closeRecentFilesMenu: (() => void) | undefined

  constructor(win: MainBrowserWindow, rpc: RpcChannel) {
    this.#win = win
    this.#rpc = rpc

    this.createRecentFilesContextMenu()
  }

  createRecentFilesContextMenu() {
    const rendererApi = this.#rpc.getAPI()

    const recentFilesMenus: MenuItemConstructorOptions[] = [
      {
        label: t`Tout sélectionner`,
        click: () => {
          rendererApi.recentFiles.selectAll()
        },
      },
      {
        label: t`Tout désélectionner`,
        click: () => {
          rendererApi.recentFiles.selectNone()
        },
      },
      {
        label: t`Inverser la sélection`,
        click() {
          rendererApi.recentFiles.invertSelection()
        },
      },
      {
        label: t`Vider`,
        click() {
          rendererApi.recentFiles.onClear()
        },
      },
    ]

    let recentFilesContextMenu: (() => void) | undefined
    let defaultContextMenu: (() => void) | undefined

    const closeRecentFilesMenu = () => {
      defaultContextMenu?.()
      recentFilesContextMenu?.()

      recentFilesContextMenu = undefined
      defaultContextMenu = contextMenu({
        window: this.#win,
      })
    }

    const openRecentFilesMenu = () => {
      defaultContextMenu?.()
      recentFilesContextMenu?.()

      defaultContextMenu = undefined
      recentFilesContextMenu = contextMenu({
        window: this.#win,
        prepend: () => recentFilesMenus,
      })
    }

    closeRecentFilesMenu()

    this.openRecentFilesMenu = openRecentFilesMenu
    this.closeRecentFilesMenu = closeRecentFilesMenu
  }
}
