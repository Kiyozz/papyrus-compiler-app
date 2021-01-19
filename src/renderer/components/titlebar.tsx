import React, { useCallback, useState } from 'react'
import * as Events from '../../common/events'
import { ipcRenderer } from '../../common/ipc'
import { useIpcSendSync, useOnIpc } from '../hooks/use-ipc'
import close10 from '../assets/icons/close-w-10.png'
import close12 from '../assets/icons/close-w-12.png'
import close15 from '../assets/icons/close-w-15.png'
import close20 from '../assets/icons/close-w-20.png'
import close24 from '../assets/icons/close-w-24.png'
import close30 from '../assets/icons/close-w-30.png'
import restore10 from '../assets/icons/restore-w-10.png'
import restore12 from '../assets/icons/restore-w-12.png'
import restore15 from '../assets/icons/restore-w-15.png'
import restore20 from '../assets/icons/restore-w-20.png'
import restore24 from '../assets/icons/restore-w-24.png'
import restore30 from '../assets/icons/restore-w-30.png'
import max10 from '../assets/icons/max-w-10.png'
import max12 from '../assets/icons/max-w-12.png'
import max15 from '../assets/icons/max-w-15.png'
import max20 from '../assets/icons/max-w-20.png'
import max24 from '../assets/icons/max-w-24.png'
import max30 from '../assets/icons/max-w-30.png'
import min10 from '../assets/icons/min-w-10.png'
import min12 from '../assets/icons/min-w-12.png'
import min15 from '../assets/icons/min-w-15.png'
import min20 from '../assets/icons/min-w-20.png'
import min24 from '../assets/icons/min-w-24.png'
import min30 from '../assets/icons/min-w-30.png'
import { useStoreSelector } from '../redux/use-store-selector'
import { AppIcon } from '../assets/logo/vector/app-icon'
import { MenuItem } from './menu-item'

function isWindowMaximizedStart(): boolean {
  return ipcRenderer.sendSync<boolean>(Events.WindowIsMaximized)
}

function CloseButtonIcon() {
  return (
    <img
      className="p-0"
      srcSet={`${close10} 1x, ${close12} 1.25x, ${close15} 1.5x, ${close15} 1.75x, ${close20} 2x, ${close20} 2.25x, ${close24} 2.5x, ${close30} 3x, ${close30} 3.5x`}
      draggable="false"
    />
  )
}

function UnmaximizeButtonIcon() {
  return (
    <img
      className="p-0"
      srcSet={`${restore10} 1x, ${restore12} 1.25x, ${restore15} 1.5x, ${restore15} 1.75x, ${restore20} 2x, ${restore20} 2.25x, ${restore24} 2.5x, ${restore30} 3x, ${restore30} 3.5x`}
      draggable="false"
    />
  )
}

function MaximizeButtonIcon() {
  return (
    <img
      className="p-0"
      srcSet={`${max10} 1x, ${max12} 1.25x, ${max15} 1.5x, ${max15} 1.75x, ${max20} 2x, ${max20} 2.25x, ${max24} 2.5x, ${max30} 3x, ${max30} 3.5x`}
      draggable="false"
    />
  )
}

function MinimizeButtonIcon() {
  return (
    <img
      className="p-0"
      srcSet={`${min10} 1x, ${min12} 1.25x, ${min15} 1.5x, ${min15} 1.75x, ${min20} 2x, ${min20} 2.25x, ${min24} 2.5x, ${min30} 3x, ${min30} 3.5x`}
      draggable="false"
    />
  )
}

export function Titlebar() {
  const [isWindowMaximized, setWindowMaximized] = useState<boolean>(
    isWindowMaximizedStart
  )
  const closeWindow = useIpcSendSync(Events.WindowClose)
  const minimizeWindow = useIpcSendSync(Events.WindowMinimize)
  const maximizeWindow = useIpcSendSync(Events.WindowMaximize)
  const unMaximizeWindow = useIpcSendSync(Events.WindowUnmaximize)

  useOnIpc<boolean>(Events.WindowIsMaximized, maximized =>
    setWindowMaximized(maximized)
  )

  const onClickClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.blur()
      closeWindow()
    },
    [closeWindow]
  )

  const onClickMinimize = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.blur()

      minimizeWindow()
    },
    [minimizeWindow]
  )

  const onClickButtonMaxUnmax = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.blur()

      setWindowMaximized(v => {
        if (v) {
          unMaximizeWindow()
          return false
        }

        maximizeWindow()
        return true
      })
    },
    [maximizeWindow, unMaximizeWindow]
  )

  const version = useStoreSelector(state => state.changelog.version)

  return (
    <header className="drag-region h-8 fixed top-0 left-0 w-full flex items-center z-10 bg-purple-800 text-gray-300 font-segoe text-sm">
      <div id="menu-icon" className="px-2">
        <AppIcon />
      </div>
      <div
        id="menu-actions"
        className="relative z-10 h-full flex items-center drag-off"
      >
        <MenuItem label="Configuration">
          <MenuItem label="Aide Aide aide aide" />
        </MenuItem>
        <MenuItem label="Aide" />
      </div>
      <div
        id="menu-title"
        className="flex absolute z-0 left-0 -translate-x-1/2 text-xs items-center justify-center w-full"
      >
        PCA {version}
      </div>
      <div
        id="menu-actions"
        className="h-full relative z-10 flex items-center drag-off ml-auto"
      >
        <button
          className="w-controls p-0 h-full cursor-default hover:bg-white hover:bg-opacity-10 flex justify-center items-center"
          onClick={onClickMinimize}
        >
          <MinimizeButtonIcon />
        </button>
        <button
          className="w-controls p-0 h-full cursor-default hover:bg-white hover:bg-opacity-10 flex justify-center items-center"
          onClick={onClickButtonMaxUnmax}
        >
          {isWindowMaximized ? (
            <UnmaximizeButtonIcon />
          ) : (
            <MaximizeButtonIcon />
          )}
        </button>
        <button
          className="w-controls p-0 h-full cursor-default hover:text-white hover:bg-red-600 flex justify-center items-center"
          onClick={onClickClose}
        >
          <CloseButtonIcon />
        </button>
      </div>
    </header>
  )
}
