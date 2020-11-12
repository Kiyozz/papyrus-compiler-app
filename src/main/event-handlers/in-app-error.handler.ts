import is from '@sindresorhus/is'
import { EventHandler } from '../interfaces/event.handler'
import { createReportDialog } from '../services/create-report-dialog.service'
import { Logger } from '../logger'

export class InAppErrorHandler implements EventHandler<Error> {
  private logger = new Logger(InAppErrorHandler.name)

  listen(args?: Error) {
    this.logger.error('an error occurred', args)

    if (is.undefined(args)) {
      return
    }

    createReportDialog(args)
  }
}
