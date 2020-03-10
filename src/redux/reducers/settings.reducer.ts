import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'
import { Games } from '../../enums/games.enum'

export interface SettingsState {
  mo2: boolean
  game: Games
  gameFolder: string
  mo2Instance: string
  mo2SourcesFolders: string[]
  installationIsBad: boolean
}

const initialState: SettingsState = {
  mo2: false,
  game: Games.LE,
  gameFolder: '',
  mo2Instance: '',
  mo2SourcesFolders: [],
  installationIsBad: false
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
    case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS:
      return {
        ...state,
        mo2SourcesFolders: action.payload || []
      }
    case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED:
      console.log('error', action.payload)

      return {
        ...state,
        mo2SourcesFolders: []
      }
    case CONSTANTS.APP_SETTINGS_SET_DETECTED_SOURCES_FOLDERS:
      return {
        ...state,
        mo2SourcesFolders: action.payload || []
      }
    case CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_SUCCESS:
      return {
        ...state,
        installationIsBad: !(action.payload ?? true)
      }
    default:
      return state
  }
}
