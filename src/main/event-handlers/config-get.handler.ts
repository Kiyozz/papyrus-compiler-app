/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Logger } from '../logger'
import { settingsStore } from '../store/settings/store'
import type { Config } from '../../common/types/config'
import type { EventHandler } from '../interfaces/event-handler'

export class ConfigGetHandler implements EventHandler {
  private logger = new Logger('ConfigGetHandler')

  listen(): Config {
    this.logger.debug('getting configuration')

    return settingsStore.store
  }
}
