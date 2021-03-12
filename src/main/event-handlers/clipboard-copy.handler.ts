/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { clipboard } from 'electron'

import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'

interface Entry {
  text: string
}

export class ClipboardCopyHandler implements EventHandler<Entry> {
  private logger = new Logger('ClipboardCopyHandler')

  listen({ text }: Entry): void {
    this.logger.debug('Copy logs to clipboard', text)

    clipboard.writeText(text, 'selection')
  }
}
