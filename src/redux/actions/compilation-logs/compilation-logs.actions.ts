import { createAction } from 'redux-actions'
import * as CONSTANTS from '../constants'
import { CompilationLogsModel } from '../../../models'

export const actionSetLogs = createAction<CompilationLogsModel>(CONSTANTS.APP_COMPILATION_LOGS_SET_LOGS)
export const actionPopupToggle = createAction<boolean>(CONSTANTS.APP_COMPILATION_LOGS_POPUP_TOGGLE)
