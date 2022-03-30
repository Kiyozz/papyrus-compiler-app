/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { Logger } from '../logger'
import { recentFilesStore } from '../store/recent-files/store'
import { ApplicationException } from '../exceptions/application.exception'
import type { Script } from '../../common/types/script'
import type { EventHandler } from '../interfaces/event-handler'

export class RecentFilesSetHandler implements EventHandler {
  private _logger = new Logger('RecentFilesSetHandler')

  listen(scripts: Script[]): Script[] {
    this._logger.debug('set recent files')

    if (is.undefined(scripts)) {
      throw new ApplicationException(
        'recent-files-set-handler: scripts is undefined',
      )
    }

    recentFilesStore.files = scripts

    return recentFilesStore.files
  }
}
