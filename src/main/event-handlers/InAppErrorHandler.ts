import is from '@sindresorhus/is'
import { HandlerInterface } from '../HandlerInterface'
import { createReportDialog } from '../services/reportDialog'

export class InAppErrorHandler implements HandlerInterface<Error> {
  listen(args?: Error) {
    if (is.undefined(args)) {
      return
    }

    createReportDialog(args)
  }
}
