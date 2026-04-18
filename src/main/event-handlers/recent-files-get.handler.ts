/*
 * 2022-2026 Kiyozz.
 */

import { Logger } from '../logger'
import { RecentFilesStore } from '../store/recent-files/store'
import type { Script } from '#common/types/script.ts'
import { inject } from '#main/inject.ts'

@inject()
export class RecentFilesGetHandler {
  readonly #logger = new Logger('RecentFilesGetHandler')
  readonly #recentFilesStore: RecentFilesStore

  constructor(recentFilesStore: RecentFilesStore) {
    this.#recentFilesStore = recentFilesStore
  }

  async listen(): Promise<Script[]> {
    this.#logger.debug('get recent files')

    return this.#recentFilesStore.files
  }
}
