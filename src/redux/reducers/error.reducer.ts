import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'

export type ErrorState = {
  [p: string]: string | undefined
  detectSourcesFoldersFailed?: string
  initializedFailed?: string
}

const initialState: ErrorState = {}

export default function errorReducer(state = initialState, action: AnyAction): ErrorState {
  function deleteSelectedKey(selected: keyof ErrorState) {
    const newState = { ...state }

    if (newState.hasOwnProperty(selected)) {
      delete newState[selected]
    }

    return newState
  }

  switch (action.type) {
    case CONSTANTS.APP_ERROR_CLEAN:
      return {}
    case CONSTANTS.APP_ERROR_CLEAN_SELECTED:
      return deleteSelectedKey(action.payload)
    case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS:
      return deleteSelectedKey('detectSourcesFoldersFailed')
    case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED:
      return {
        ...state,
        detectSourcesFoldersFailed: action.payload
      }
    case CONSTANTS.APP_INITIALIZATION_FAILED:
      return {
        ...state,
        initializedFailed: action.payload
      }
    case CONSTANTS.APP_INITIALIZATION_SUCCESS:
      return deleteSelectedKey('initializedFailed')
    default:
      return state
  }
}
