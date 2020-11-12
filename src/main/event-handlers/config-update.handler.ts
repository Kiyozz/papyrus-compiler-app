import is from '@sindresorhus/is'
import deepmerge from 'deepmerge'
import { appStore } from '../../common/store'
import { Config } from '../../common/interfaces/config.interface'
import { PartialDeep } from '../../common/interfaces/misc.interface'
import { EventHandler } from '../interfaces/event.handler'
import { Logger } from '../logger'

interface ConfigUpdateHandlerParams {
  config: PartialDeep<Config>
  override?: boolean
}

export class ConfigUpdateHandler
  implements EventHandler<ConfigUpdateHandlerParams> {
  private logger = new Logger(ConfigUpdateHandler.name)

  listen(args?: ConfigUpdateHandlerParams): Config {
    this.logger.debug('updating the configuration')

    if (is.undefined(args)) {
      throw new TypeError('cannot update the configuration without arguments')
    }

    ;(Object.entries(args.config) as [keyof Config, unknown][]).forEach(
      ([key, value]) => {
        this.logger.debug('updating key', key, 'with value', value)

        if (!appStore.has(key)) {
          return
        }

        this.handleGamePath(key, value)

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

  private handleGamePath(key: keyof Config, value: unknown) {
    this.logger.debug('handling game path update')

    if (key === 'gamePath' && is.string(value)) {
      appStore.set('gamePath', value)
    }
  }
}
