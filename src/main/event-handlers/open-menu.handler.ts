/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { BrowserWindow, Menu } from 'electron'
import type { EventHandler } from '../interfaces/event-handler'

export class OpenMenuHandler implements EventHandler {
  private readonly _win: BrowserWindow
  private readonly _menu: Menu

  constructor({ win, menu }: { win: BrowserWindow; menu: Menu }) {
    this._win = win
    this._menu = menu
  }

  listen({ x, y }: { x: number; y: number }): void {
    this._menu.popup({
      window: this._win,
      x,
      y,
    })
  }
}
