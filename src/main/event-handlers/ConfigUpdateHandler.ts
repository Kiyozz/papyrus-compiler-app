import is from '@sindresorhus/is'
import deepmerge from 'deepmerge'
import appStore from '../../common/appStore'
import type { Config, PartialDeep } from '@common'
import { HandlerInterface } from '../HandlerInterface'
import Log from '../services/Log'

const log = new Log('ConfigUpdateHandler')

interface ConfigUpdateHandlerParams {
  config: PartialDeep<Config>
  override?: boolean
}

export default class ConfigUpdateHandler implements HandlerInterface<ConfigUpdateHandlerParams> {
  listen(args?: ConfigUpdateHandlerParams): Config {
    log.info('Updating the configuration')

    if (is.undefined(args)) {
      throw new TypeError('Cannot update the configuration without arguments')
    }

    Object.entries(args.config).forEach(([key, value]) => {
      log.debug('Updating key', key, 'with value', value)

      if (args.override) {
        log.debug('Total overwrite of the previous value')

        appStore.set(key, value)
      } else {
        const keyValue = appStore.get(key, value)

        if (is.array(keyValue)) {
          appStore.set(key, value)
        } else if (is.object(keyValue) && is.object(value) && !is.array(value)) {
          appStore.set(key, deepmerge(keyValue, value))
        } else {
          appStore.set(key, value)
        }
      }
    })

    return appStore.store
  }
}