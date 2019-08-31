import * as CONSTANTS from '../constants'
import { createAction } from 'redux-actions'
import { Games } from '../../../enums/games.enum'

export const actionSetGame = createAction<Games>(CONSTANTS.APP_SETTINGS_SET_GAME)
export const actionSetGameFolder = createAction<string>(CONSTANTS.APP_SETTINGS_SET_GAME_FOLDER)
export const actionSetUseMo2 = createAction<boolean>(CONSTANTS.APP_SETTINGS_SET_USE_MO2)
export const actionSetMo2Instance = createAction<string>(CONSTANTS.APP_SETTINGS_SET_MO2_INSTANCE)
