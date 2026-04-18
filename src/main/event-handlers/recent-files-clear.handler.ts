/*
 * 2022-2026 Kiyozz.
 */

import { Logger } from '../logger'
import { RecentFilesStore } from '../store/recent-files/store'
import { inject } from '#main/inject.ts'

@inject()
export class RecentFilesClearHandler {
  readonly #logger = new Logger('RecentFilesClearHandler')
  readonly #recentFilesStore: RecentFilesStore

  constructor(recentFilesStore: RecentFilesStore) {
    this.#recentFilesStore = recentFilesStore
  }

  async listen() {
    this.#logger.debug('clear recent files')

    this.#recentFilesStore.clearFiles()
  }
}
