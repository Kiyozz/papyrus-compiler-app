/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { clipboard } from 'electron'
import { Logger } from '../logger'
import type { EventHandler } from '../interfaces/event-handler'

interface ClipboardCopyArgs {
  text: string
}

export class ClipboardCopyHandler implements EventHandler {
  private logger = new Logger('ClipboardCopyHandler')

  listen({ text }: ClipboardCopyArgs): void {
    this.logger.debug('Copy logs to clipboard', text)

    clipboard.writeText(text, 'selection')
  }
}
