/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { dialog } from 'electron'
import { debugInfo } from 'electron-util/main'
import { Logger } from '../logger'
import { Telemetry } from '../telemetry/telemetry'
import { inject } from '#main/inject.ts'

@inject()
export class InAppErrorHandler {
  readonly #logger = new Logger('InAppErrorHandler')
  readonly #telemetry: Telemetry

  constructor(telemetry: Telemetry) {
    this.#telemetry = telemetry
  }

  async listen(args?: Error): Promise<void> {
    this.#logger.error('an error occurred', args)

    if (is.undefined(args)) {
      return
    }

    await this.#telemetry.exception({
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
