/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import contextMenu from 'electron-context-menu'
import { ipcMain } from './ipc'
import { IpcEvent } from './ipc-event'
import type { MenuItemConstructorOptions } from 'electron'

export async function registerContextMenu(
  win: Electron.BrowserWindow,
): Promise<void> {
  const t = await (await import('./translations/index')).instance

  const recentFilesMenus: MenuItemConstructorOptions[] = [
    {
      label: t('contextMenu.select.all'),
      click() {
        win.webContents.send(IpcEvent.recentFilesSelectAll)
      },
    },
    {
      label: t('contextMenu.select.none'),
      click() {
        win.webContents.send(IpcEvent.recentFilesSelectNone)
      },
    },
    {
      label: t('contextMenu.select.invert'),
      click() {
        win.webContents.send(IpcEvent.recentFilesInvertSelection)
      },
    },
    {
      label: t('contextMenu.select.clear'),
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
