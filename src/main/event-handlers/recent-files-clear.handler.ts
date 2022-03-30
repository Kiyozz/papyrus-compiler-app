/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Logger } from '../logger'
import { recentFilesStore } from '../store/recent-files/store'
import type { EventHandler } from '../interfaces/event-handler'

export class RecentFilesClearHandler implements EventHandler {
  private _logger = new Logger('RecentFilesClearHandler')

  listen() {
    this._logger.debug('clear recent files')

    recentFilesStore.clearFiles()
  }
}
