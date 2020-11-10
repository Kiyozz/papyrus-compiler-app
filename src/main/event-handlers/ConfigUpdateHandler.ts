import is from '@sindresorhus/is'
import deepmerge from 'deepmerge'
import { appStore } from '@pca/common/store'
import { Config } from '@pca/common/interfaces/Config'
import { PartialDeep } from '@pca/common/interfaces/PartialDeep'
import { EventHandler } from '../EventHandler'
import { Logger } from '../Logger'

const logger = new Logger('ConfigUpdateHandler')

interface ConfigUpdateHandlerParams {
  config: PartialDeep<Config>
  override?: boolean
}

export class ConfigUpdateHandler
  implements EventHandler<ConfigUpdateHandlerParams> {
  listen(args?: ConfigUpdateHandlerParams): Config {
    logger.info('updating the configuration')

    if (is.undefined(args)) {
      throw new TypeError('cannot update the configuration without arguments')
    }

    ;(Object.entries(args.config) as [keyof Config, unknown][]).forEach(
      ([key, value]) => {
        logger.debug('updating key', key, 'with value', value)

        if (!appStore.has(key)) {
          return
        }

        this.handleGamePath(key, value)

        if (args.override) {
          logger.debug('total overwrite of the previous value')

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
    if (key === 'gamePath' && is.string(value)) {
      appStore.set('gamePath', value)
    }
  }
}
