/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Logger } from '../logger'
import { recentFilesStore } from '../store/recent-files/store'
import type { Script } from '../../common/types/script'
import type { EventHandler } from '../interfaces/event-handler'

export class RecentFilesGetHandler implements EventHandler {
  private _logger = new Logger('RecentFilesGetHandler')

  listen(): Script[] {
    this._logger.debug('get recent files')

    return recentFilesStore.files
  }
}
