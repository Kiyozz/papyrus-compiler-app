/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { recentFilesStore } from '../store/recent-files/store'

export class RecentFilesClearHandler implements EventHandler {
  private _logger = new Logger('RecentFilesClearHandler')

  async listen(): Promise<void> {
    this._logger.debug('clear recent files')

    recentFilesStore.clearFiles()
  }
}
