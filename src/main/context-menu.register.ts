/*
 * 2022-2026 Kiyozz.
 */

import contextMenu from 'electron-context-menu'
import type { MenuItemConstructorOptions } from 'electron'
import { t } from '@lingui/core/macro'

interface ContextMenuCallbacks {
  onSelectAll: () => void
  onSelectNone: () => void
  onInvertSelection: () => void
  onClear: () => void
}

export async function registerContextMenu(
  win: Electron.BrowserWindow,
  callbacks: ContextMenuCallbacks,
): Promise<{
  openRecentFilesMenu: () => void
  closeRecentFilesMenu: () => void
}> {
  const recentFilesMenus: MenuItemConstructorOptions[] = [
    {
      label: t`Tout sélectionner`,
      click() {
        callbacks.onSelectAll()
      },
    },
    {
      label: t`Tout désélectionner`,
      click() {
        callbacks.onSelectNone()
      },
    },
    {
      label: t`Inverser la sélection`,
      click() {
        callbacks.onInvertSelection()
      },
    },
    {
      label: t`Vider`,
      click() {
        callbacks.onClear()
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
      window: win,
    })
  }

  const openRecentFilesMenu = () => {
    defaultContextMenu?.()
    recentFilesContextMenu?.()

    defaultContextMenu = undefined
    recentFilesContextMenu = contextMenu({
      window: win,
      prepend: () => recentFilesMenus,
    })
  }

  closeRecentFilesMenu()

  return { openRecentFilesMenu, closeRecentFilesMenu }
}
