/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { createReportDialog } from '../services/create-report-dialog.service'
import { Logger } from '../logger'

export class InAppErrorHandler implements EventHandlerInterface<Error> {
  private logger = new Logger('InAppErrorHandler')

  listen(args?: Error) {
    this.logger.error('an error occurred', args)

    if (is.undefined(args)) {
      return
    }

    createReportDialog(args)
  }
}
