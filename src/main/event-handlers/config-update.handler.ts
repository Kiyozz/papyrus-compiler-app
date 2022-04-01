/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import deepmerge from 'deepmerge'
import { Logger } from '../logger'
import { settingsStore } from '../store/settings/store'
import type { PartialDeep } from 'type-fest'
import type { Config } from '../../common/types/config'
import type { EventHandler } from '../interfaces/event-handler'

interface ConfigUpdateHandlerParams {
  config: PartialDeep<Config>
  override?: boolean
}

export class ConfigUpdateHandler implements EventHandler {
  private logger = new Logger('ConfigUpdateHandler')

  listen(args?: ConfigUpdateHandlerParams): Config {
    this.logger.debug('updating the configuration')

    if (is.undefined(args)) {
      throw new TypeError('cannot update the configuration without arguments')
    }

    ;(Object.entries(args.config) as [keyof Config, unknown][]).forEach(
      ([key, value]) => {
        if (!settingsStore.has(key)) {
          return
        }

        this.logger.debug('updating key', key, 'with value', value)

        if (args.override) {
          this.logger.debug('total overwrite of the previous value')

          settingsStore.set(key, value)
        } else {
          const keyValue = settingsStore.get(key)

          if (is.array(keyValue)) {
            settingsStore.set(key, value)
          } else if (
            is.object(keyValue) &&
            is.object(value) &&
            !is.array(value)
          ) {
            settingsStore.set(key, deepmerge(keyValue, value))
          } else {
            settingsStore.set(key, value)
          }
        }
      },
    )

    return settingsStore.store
  }
}
