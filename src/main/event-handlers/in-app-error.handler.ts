/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { dialog } from 'electron'
import { debugInfo } from 'electron-util'

import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { Telemetry } from '../telemetry/telemetry'

export class InAppErrorHandler implements EventHandler<Error> {
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
        stack:
          `[${args.stack?.length}] ${args.stack?.slice(0, 600)}` ?? 'unknown',
      },
    })

    dialog.showErrorBox(
      'A JavaScript error occurred in the renderer process.',
      `${debugInfo()}
      
      ${args ?? 'unknown error'}`,
    )
  }
}
