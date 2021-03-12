/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Config } from '../../common/interfaces/config'
import { appStore } from '../../common/store'
import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'

export class ConfigGetHandler implements EventHandler {
  private logger = new Logger('ConfigGetHandler')

  listen(): Config {
    this.logger.debug('getting configuration')

    return appStore.store
  }
}
