import { AnyAction } from 'redux'
import { CONSTANTS } from '../actions'

interface LocalSettings {
  installationIsBad: boolean
  mo2: {
    sources: string[]
    sourcesError?: Error
  }
}

export type SettingsState = LocalSettings

const defaultInitial: LocalSettings = {
  installationIsBad: false,
  mo2: {
    sources: []
  }
}

export default function createSettingsReducer() {
  return function settingsReducer(state = defaultInitial, action: AnyAction): SettingsState {
    switch (action.type) {
      case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS:
        return {
          ...state,
          mo2: {
            sources: action.payload ?? [],
            sourcesError: undefined
          }
        }
      case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED:
        return {
          ...state,
          mo2: {
            sources: [],
            sourcesError: action.payload
          }
        }
      case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_EMPTY:
        return {
          ...state,
          mo2: {
            sources: [],
            sourcesError: undefined
          }
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
}
