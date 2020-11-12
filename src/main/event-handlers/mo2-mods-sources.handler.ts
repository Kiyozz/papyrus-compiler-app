import { EventHandler } from '../interfaces/event.handler'
import { Logger } from '../logger'

export class Mo2ModsSourcesHandler implements EventHandler {
  private logger = new Logger(Mo2ModsSourcesHandler.name)

  listen() {
    this.logger.deprecated('this handler is deprecated')

    return []
  }
}
