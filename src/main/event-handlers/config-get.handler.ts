/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Config } from '../../common/interfaces/config'
import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { settingsStore } from '../store/settings/store'

export class ConfigGetHandler implements EventHandler {
  private logger = new Logger('ConfigGetHandler')

  listen(): Config {
    this.logger.debug('getting configuration')

    return settingsStore.store
  }
}
