/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import deepmerge from 'deepmerge'
import { Logger, applyLogLevel } from '../logger'
import type { PartialDeep } from 'type-fest'
import type { LogLevel } from '#common/log-level.ts'
import type { Config } from '#common/types/config.ts'
import { inject } from '#main/inject.ts'
import { SettingsStore } from '#main/store/settings/store.ts'

interface ConfigUpdateHandlerParams {
  config: PartialDeep<Config>
  override?: boolean
}

@inject()
export class ConfigUpdateHandler {
  #logger = new Logger('ConfigUpdateHandler')
  #settingsStore: SettingsStore

  constructor(settingsStore: SettingsStore) {
    this.#settingsStore = settingsStore
  }

  async listen(args?: ConfigUpdateHandlerParams): Promise<Config> {
    this.#logger.debug('updating the configuration')

    if (is.undefined(args)) {
      throw new TypeError('cannot update the configuration without arguments')
    }

    ;(Object.entries(args.config) as [keyof Config, unknown][]).forEach(
      ([key, value]) => {
        if (!this.#settingsStore.has(key)) {
          return
        }

        this.#logger.debug('updating key', key, 'with value', value)

        if (args.override) {
          this.#logger.debug('total overwrite of the previous value')

          this.#settingsStore.set(key, value)
        } else {
          const keyValue = this.#settingsStore.get(key)

          if (is.array(keyValue)) {
            this.#settingsStore.set(key, value)
          } else if (
            is.object(keyValue) &&
            is.object(value) &&
            !is.array(value)
          ) {
            this.#settingsStore.set(key, deepmerge(keyValue, value))
          } else {
            this.#settingsStore.set(key, value)
          }
        }
      },
    )

    if (!is.undefined(args.config.logLevel)) {
      applyLogLevel(args.config.logLevel as LogLevel)
    }

    return this.#settingsStore.store
  }
}
