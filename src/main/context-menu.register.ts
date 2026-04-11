/*
 * 2022-2026 Kiyozz.
 */

import contextMenu from 'electron-context-menu'
import { ipcMain } from './ipc'
import { IpcEvent } from './ipc-event'
import type { MenuItemConstructorOptions } from 'electron'
import { t } from '@lingui/core/macro'

export async function registerContextMenu(
  win: Electron.BrowserWindow,
): Promise<void> {
  const recentFilesMenus: MenuItemConstructorOptions[] = [
    {
      label: t`Tout sélectionner`,
      click() {
        win.webContents.send(IpcEvent.recentFilesSelectAll)
      },
    },
    {
      label: t`Tout désélectionner`,
      click() {
        win.webContents.send(IpcEvent.recentFilesSelectNone)
      },
    },
    {
      label: t`Inverser la sélection`,
      click() {
        win.webContents.send(IpcEvent.recentFilesInvertSelection)
      },
    },
    {
      label: t`Vider`,
      click() {
        win.webContents.send(IpcEvent.recentFilesOnClear)
      },
    },
  ]

  let recentFilesContextMenu: (() => void) | undefined
  let defaultContextMenu: (() => void) | undefined

  const createDefaultMenu = () => {
    defaultContextMenu?.()
    recentFilesContextMenu?.()

    recentFilesContextMenu = undefined
    defaultContextMenu = contextMenu({
      window: win,
    })
  }

  const createRecentFilesMenu = () => {
    defaultContextMenu?.()
    recentFilesContextMenu?.()

    defaultContextMenu = undefined
    recentFilesContextMenu = contextMenu({
      window: win,
      prepend: () => recentFilesMenus,
    })
  }

  ipcMain.on(IpcEvent.recentFilesDialogClose, () => {
    createDefaultMenu()
  })

  ipcMain.on(IpcEvent.recentFilesDialogOpen, () => {
    createRecentFilesMenu()
  })
}
