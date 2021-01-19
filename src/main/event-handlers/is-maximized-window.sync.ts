/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { BrowserWindow } from 'electron'
import * as Events from '../../common/events'
import { EventSyncInterface } from '../interfaces/event.sync.interface'

export class IsMaximizedWindowSync implements EventSyncInterface {
  constructor(private win: BrowserWindow) {
    this.win.on('maximize', () =>
      this.win.webContents.send(Events.WindowIsMaximized, true)
    )
    this.win.on('unmaximize', () =>
      this.win.webContents.send(Events.WindowIsMaximized, false)
    )
  }

  onSync(): boolean {
    return this.win.isMaximized()
  }
}
