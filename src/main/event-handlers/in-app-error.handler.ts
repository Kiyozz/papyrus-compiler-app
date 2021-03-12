/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { createReportDialog } from '../report/create-report-dialog'

export class InAppErrorHandler implements EventHandler<Error> {
  private logger = new Logger('InAppErrorHandler')

  listen(args?: Error): void {
    this.logger.error('an error occurred', args)

    if (is.undefined(args)) {
      return
    }

    createReportDialog(args)
  }
}
