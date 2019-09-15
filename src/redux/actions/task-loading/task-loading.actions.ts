import { createAction } from 'redux-actions'
import * as CONSTANTS from '../constants'

export const actionSetTaskLoading = createAction<boolean>(CONSTANTS.APP_TASK_LOADING_SET)
