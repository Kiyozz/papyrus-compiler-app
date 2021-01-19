/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { BrowserWindow } from 'electron'
import { EventSyncInterface } from '../interfaces/event.sync.interface'

export class CloseWindowSync implements EventSyncInterface {
  constructor(private win: BrowserWindow) {}

  onSync() {
    this.win.close()
  }
}
