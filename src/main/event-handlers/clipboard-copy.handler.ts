/*
 * 2022-2026 Kiyozz.
 */

import { clipboard } from 'electron'
import { Logger } from '../logger'
import { inject } from '#main/inject.ts'

interface ClipboardCopyArgs {
  text: string
}

@inject()
export class ClipboardCopyHandler {
  private logger = new Logger('ClipboardCopyHandler')

  async listen({ text }: ClipboardCopyArgs): Promise<void> {
    this.logger.debug('Copy logs to clipboard', text)

    clipboard.writeText(text, 'selection')
  }
}
