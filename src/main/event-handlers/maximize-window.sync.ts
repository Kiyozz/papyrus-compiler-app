/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { BrowserWindow } from 'electron'
import { EventSyncInterface } from '../interfaces/event.sync.interface'

export class MaximizeWindowSync implements EventSyncInterface {
  constructor(private win: BrowserWindow) {}

  onSync() {
    if (this.win.isMaximizable()) {
      this.win.maximize()
    }
  }
}
