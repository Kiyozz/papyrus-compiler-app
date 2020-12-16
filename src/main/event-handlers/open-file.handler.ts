/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { shell } from 'electron'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { Logger } from '../logger'

export class OpenFileHandler implements EventHandlerInterface {
  private logger = new Logger(OpenFileHandler.name)

  async listen(file: string): Promise<void> {
    this.logger.debug('opening the file', file)

    try {
      await shell.openExternal(file)
    } catch (e) {
      if (e.message.includes('Invalid URL')) {
        await shell.openExternal(`file://${file}`)
      } else {
        throw e
      }
    }
  }
}
