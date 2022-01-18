/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Config } from '../../common/types/config'
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
