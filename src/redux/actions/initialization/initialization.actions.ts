import { createAction } from 'redux-actions'
import * as CONSTANTS from '../constants'

export const actionInitializationSuccess = createAction(CONSTANTS.APP_INITIALIZATION_SUCCESS)
export const actionInitializationFailed = createAction<any>(CONSTANTS.APP_INITIALIZATION_FAILED)
export const actionInitialization = createAction(CONSTANTS.APP_INITIALIZATION)
