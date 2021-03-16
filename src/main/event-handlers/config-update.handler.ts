/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import deepmerge from 'deepmerge'
import { PartialDeep } from 'type-fest'

import { Config } from '../../common/interfaces/config'
import { appStore } from '../../common/store'
import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'

interface ConfigUpdateHandlerParams {
  config: PartialDeep<Config>
  override?: boolean
}

export class ConfigUpdateHandler
  implements EventHandler<ConfigUpdateHandlerParams> {
  private logger = new Logger('ConfigUpdateHandler')

  listen(args?: ConfigUpdateHandlerParams): Config {
    this.logger.debug('updating the configuration')

    if (is.undefined(args)) {
      throw new TypeError('cannot update the configuration without arguments')
    }

    ;(Object.entries(args.config) as [keyof Config, unknown][]).forEach(
      ([key, value]) => {
        if (!appStore.has(key)) {
          return
        }

        this.logger.debug('updating key', key, 'with value', value)

        if (args.override) {
          this.logger.debug('total overwrite of the previous value')

          appStore.set(key, value)
        } else {
          const keyValue = appStore.get(key)

          if (is.array(keyValue)) {
            appStore.set(key, value)
          } else if (
            is.object(keyValue) &&
            is.object(value) &&
            !is.array(value)
          ) {
            appStore.set(key, deepmerge(keyValue, value))
          } else {
            appStore.set(key, value)
          }
        }
      }
    )

    return appStore.store
  }
}
