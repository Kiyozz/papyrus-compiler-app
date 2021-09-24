/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { BrowserWindow, Menu } from 'electron'

import { EventHandler } from '../interfaces/event-handler'

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
