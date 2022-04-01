/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { dialog } from 'electron'
import { debugInfo } from 'electron-util'
import { Logger } from '../logger'
import type { EventHandler } from '../interfaces/event-handler'
import type { Telemetry } from '../telemetry/telemetry'

export class InAppErrorHandler implements EventHandler {
  private logger = new Logger('InAppErrorHandler')

  constructor(private telemetry: Telemetry) {}

  async listen(args?: Error): Promise<void> {
    this.logger.error('an error occurred', args)

    if (is.undefined(args)) {
      return
    }

    await this.telemetry.exception({
      properties: {
        error: args.message,
        stack: !args.stack
          ? 'unknown stack'
          : `[${args.stack.length}] ${args.stack.slice(0, 600)}${
              args.stack.length > 600 ? '...' : ''
            }`,
      },
    })

    dialog.showErrorBox(
      'A JavaScript error occurred in the renderer process.',
      `${debugInfo()}
      
      ${args.message}
      
      ${args.stack ?? 'unknown stack'}`,
    )
  }
}
