/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { BrowserWindow } from 'electron'
import { EventSyncInterface } from '../interfaces/event.sync.interface'

export class MinimizeWindowSync implements EventSyncInterface {
  constructor(private win: BrowserWindow) {}

  onSync() {
    if (this.win.isMinimizable()) {
      this.win.minimize()
    }
  }
}
