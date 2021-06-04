/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Script } from '../../common/interfaces/script'
import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { recentFilesStore } from '../store/recent-files/store'

export class RecentFilesRemoveHandler implements EventHandler {
  private _logger = new Logger('RecentFilesRemoveHandler')

  async listen(script: Script): Promise<Script[]> {
    this._logger.info('remove recent file')

    recentFilesStore.removeFile(script)

    return recentFilesStore.files
  }
}
