/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { IpcEvent } from '../ipc-event'
import type { BrowserWindow } from 'electron'
import type { WindowState } from '../../common/types/window-state'
import type { EventHandler } from '../interfaces/event-handler'

export function listenToWindowState(win: BrowserWindow) {
  win.on('minimize', () =>
    win.webContents.send(
      IpcEvent.windowStateChange,
      'minimized' as WindowState,
    ),
  )
  win.on('enter-full-screen', () =>
    win.webContents.send(
      IpcEvent.windowStateChange,
      'maximized' as WindowState,
    ),
  )
  win.on('leave-full-screen', () =>
    win.webContents.send(IpcEvent.windowStateChange, 'normal' as WindowState),
  )
  win.on('maximize', () =>
    win.webContents.send(
      IpcEvent.windowStateChange,
      'maximized' as WindowState,
    ),
  )
  win.on('unmaximize', () =>
    win.webContents.send(IpcEvent.windowStateChange, 'normal' as WindowState),
  )
}

export class WindowCloseHandler implements EventHandler {
  constructor(private _win: BrowserWindow) {}

  listen() {
    if (this._win.closable) {
      this._win.close()
    }
  }
}

export class WindowMinimizeHandler implements EventHandler {
  constructor(private _win: BrowserWindow) {}

  listen() {
    if (this._win.isMinimizable()) {
      this._win.minimize()
    }
  }
}

export class WindowMaximizeHandler implements EventHandler {
  constructor(private _win: BrowserWindow) {}

  listen() {
    if (this._win.isMaximizable()) {
      this._win.maximize()
    }
  }
}

export class WindowRestoreHandler implements EventHandler {
  constructor(private _win: BrowserWindow) {}

  listen() {
    this._win.restore()
  }
}
