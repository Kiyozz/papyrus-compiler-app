/*
 *   Copyright (c) 2021 Kiyozz
 *   All rights reserved.
 */

import { Script } from '../../common/interfaces/script'
import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { recentFilesStore } from '../store/recent-files/store'

export class RecentFilesSetHandler implements EventHandler {
  private _logger = new Logger('RecentFilesSetHandler')

  async listen(args: Script[]): Promise<Script[]> {
    this._logger.debug('set recent files')

    recentFilesStore.files = args

    return recentFilesStore.files
  }
}
