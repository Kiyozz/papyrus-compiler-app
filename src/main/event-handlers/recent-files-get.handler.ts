/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Script } from '../../common/types/script'
import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { recentFilesStore } from '../store/recent-files/store'

export class RecentFilesGetHandler implements EventHandler {
  private _logger = new Logger('RecentFilesGetHandler')

  async listen(): Promise<Script[]> {
    this._logger.debug('get recent files')

    return recentFilesStore.files
  }
}
