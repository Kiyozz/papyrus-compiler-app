import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'
import { Games } from '../../enums/games.enum'

export interface SettingsState {
  mo2: boolean
  game: Games
  gameFolder: string
  mo2Instance: string
}

const initialState: SettingsState = {
  mo2: false,
  game: Games.LE,
  gameFolder: '',
  mo2Instance: ''
}

export default function settingsReducer(state = initialState, action: AnyAction): SettingsState {
  switch (action.type) {
    case CONSTANTS.APP_SETTINGS_SET_USE_MO2:
      return {
        ...state,
        mo2: action.payload || false
      }
    case CONSTANTS.APP_SETTINGS_SET_GAME:
      return {
        ...state,
        game: action.payload || Games.LE
      }
    case CONSTANTS.APP_SETTINGS_SET_GAME_FOLDER:
      return {
        ...state,
        gameFolder: action.payload.trim() || ''
      }
    case CONSTANTS.APP_SETTINGS_SET_MO2_INSTANCE:
      return {
        ...state,
        mo2Instance: action.payload.trim() || ''
      }
    default:
      return state
  }
}
