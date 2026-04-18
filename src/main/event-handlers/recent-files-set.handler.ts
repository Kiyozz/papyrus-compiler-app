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
export class RecentFilesSetHandler {
  readonly #logger = new Logger('RecentFilesSetHandler')
  readonly #recentFilesStore: RecentFilesStore

  constructor(recentFilesStore: RecentFilesStore) {
    this.#recentFilesStore = recentFilesStore
  }

  async listen(scripts: Script[]): Promise<Script[]> {
    this.#logger.debug('set recent files')

    if (is.undefined(scripts)) {
      throw new ApplicationException(
        'recent-files-set-handler: scripts is undefined',
      )
    }

    this.#recentFilesStore.files = scripts

    return this.#recentFilesStore.files
  }
}
