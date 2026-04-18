/*
 * 2022-2026 Kiyozz.
 */

import { Logger } from '../logger'
import { SettingsStore } from '../store/settings/store'
import type { Config } from '#common/types/config.ts'
import { inject } from '#main/inject.ts'

@inject()
export class ConfigGetHandler {
  #logger = new Logger('ConfigGetHandler')
  #settingsStore: SettingsStore

  constructor(settingsStore: SettingsStore) {
    this.#settingsStore = settingsStore
  }

  async listen(): Promise<Config> {
    this.#logger.debug('getting configuration')

    return this.#settingsStore.store
  }
}
