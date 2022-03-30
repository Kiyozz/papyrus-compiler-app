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

export class RecentFilesRemoveHandler implements EventHandler {
  private _logger = new Logger('RecentFilesRemoveHandler')

  listen(script: Script): Script[] {
    this._logger.info('remove recent file')

    if (is.undefined(script)) {
      throw new ApplicationException(
        'recent-files-remove-handler: script is undefined',
      )
    }

    recentFilesStore.removeFile(script)

    return recentFilesStore.files
  }
}
