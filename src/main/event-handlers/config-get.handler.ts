/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { appStore } from '../../common/store'
import { Config } from '../../common/interfaces/config.interface'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { Logger } from '../logger'

export class ConfigGetHandler implements EventHandlerInterface {
  private logger = new Logger('ConfigGetHandler')

  listen(): Config {
    this.logger.debug('getting configuration')

    return appStore.store
  }
}
