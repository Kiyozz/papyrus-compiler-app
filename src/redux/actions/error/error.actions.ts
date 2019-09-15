import { createAction } from 'redux-actions'
import * as CONSTANTS from '../constants'

export const actionErrorClean = createAction(CONSTANTS.APP_ERROR_CLEAN)
export const actionErrorCleanSelected = createAction<string>(CONSTANTS.APP_ERROR_CLEAN_SELECTED)
