/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { clipboard } from 'electron'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { Logger } from '../logger'

interface Entry {
  text: string
}

export class ClipboardCopyHandler implements EventHandlerInterface<Entry> {
  private logger = new Logger('ClipboardCopyHandler')

  listen({ text }: Entry) {
    this.logger.debug('Copy logs to clipboard', text)

    clipboard.writeText(text, 'selection')
  }
}
