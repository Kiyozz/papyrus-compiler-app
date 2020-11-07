import is from '@sindresorhus/is'
import { EventHandler } from '../EventHandler'
import { createReportDialog } from '../services/createReportDialog'

export class InAppErrorHandler implements EventHandler<Error> {
  listen(args?: Error) {
    if (is.undefined(args)) {
      return
    }

    createReportDialog(args)
  }
}
