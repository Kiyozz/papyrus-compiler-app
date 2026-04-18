/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { Logger } from '../logger'
import { RecentFilesStore } from '../store/recent-files/store'
import { ApplicationException } from '../exceptions/application.exception'
import type { Script } from '#common/types/script.ts'
import { inject } from '#main/inject.ts'

@inject()
export class RecentFilesRemoveHandler {
  readonly #logger = new Logger('RecentFilesRemoveHandler')
  readonly #recentFilesStore: RecentFilesStore

  constructor(recentFilesStore: RecentFilesStore) {
    this.#recentFilesStore = recentFilesStore
  }

  async listen(script: Script): Promise<Script[]> {
    this.#logger.info('remove recent file')

    if (is.undefined(script)) {
      throw new ApplicationException(
        'recent-files-remove-handler: script is undefined',
      )
    }

    this.#recentFilesStore.removeFile(script)

    return this.#recentFilesStore.files
  }
}
