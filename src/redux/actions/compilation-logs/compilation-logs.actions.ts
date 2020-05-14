import { createAction } from 'redux-actions'
import { CompilationLogsModel } from '../../../models'
import * as CONSTANTS from '../constants'

export const actionSetLogs = createAction<CompilationLogsModel>(CONSTANTS.APP_COMPILATION_LOGS_SET_LOGS)
export const actionPopupToggle = createAction<boolean>(CONSTANTS.APP_COMPILATION_LOGS_POPUP_TOGGLE)
