import { appStore } from '@pca/common/store'
import { Config } from '@pca/common/interfaces/Config'
import { EventHandler } from '../EventHandler'
import { Logger } from '../Logger'

const logger = new Logger('ConfigUpdateHandler')

export class ConfigGetHandler implements EventHandler {
  listen(): Config {
    logger.debug('Get configuration')

    return appStore.store
  }
}
