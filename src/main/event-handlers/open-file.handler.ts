/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { shell } from 'electron'
import { EventHandler } from '../interfaces/event.handler'
import { Logger } from '../logger'

export class OpenFileHandler implements EventHandler {
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
