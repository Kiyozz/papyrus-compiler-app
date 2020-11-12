import { appStore } from '../../common/store'
import { Config } from '../../common/interfaces/config.interface'
import { EventHandler } from '../interfaces/event.handler'
import { Logger } from '../logger'

export class ConfigGetHandler implements EventHandler {
  private logger = new Logger(ConfigGetHandler.name)

  listen(): Config {
    this.logger.debug('getting configuration')

    return appStore.store
  }
}
