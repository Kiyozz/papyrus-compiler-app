/*
 *   Copyright (c) 2021 Kiyozz
 *   All rights reserved.
 */

import { MenuItemConstructorOptions } from 'electron'
import contextMenu from 'electron-context-menu'

import { ipcMain } from './ipc'
import { IpcEvent } from './ipc-event'

export function registerContextMenu(win: Electron.BrowserWindow): void {
  const recentFilesMenus: MenuItemConstructorOptions[] = [
    {
      label: 'Select all',
      click() {
        win.webContents.send(IpcEvent.recentFilesSelectAll)
      },
    },
    {
      label: 'Select none',
      click() {
        win.webContents.send(IpcEvent.recentFilesSelectNone)
      },
    },
    {
      label: 'Revert selection',
      click() {
        win.webContents.send(IpcEvent.recentFilesRevertSelection)
      },
    },
    {
      label: 'Clear',
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
