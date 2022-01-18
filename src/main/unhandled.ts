/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { dialog } from 'electron'
import { debugInfo } from 'electron-util'

import { Logger } from './logger'

const logger = new Logger('Unhandled')

export function unhandled(onError: () => void): void {
  logger.catchErrors({
    showDialog: false,
    onError(error: Error) {
      dialog.showErrorBox(
        'A JavaScript error occurred.',
        `
        ${debugInfo()}
        
        ${error.stack}`,
      )
      onError()
    },
  })
}
