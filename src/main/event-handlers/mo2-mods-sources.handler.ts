/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { Logger } from '../logger'

export class Mo2ModsSourcesHandler implements EventHandlerInterface {
  private logger = new Logger(Mo2ModsSourcesHandler.name)

  listen() {
    this.logger.deprecated('this handler is deprecated')

    return []
  }
}
