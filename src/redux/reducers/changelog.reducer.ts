import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'

export interface ChangelogState {
  startingVersion: string
  version: string
  notes: string
}

export default function createChangeLogReducer(prefix: string) {
  const startingVersion = process.env.REACT_APP_VERSION || ''
  const latestVersionSaved = localStorage.getItem(`${prefix}/${CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION}`) || ''
  const initialState: ChangelogState = {
    startingVersion,
    version: latestVersionSaved,
    notes: ''
  }

  return function changelogReducer(state = initialState, action: AnyAction): ChangelogState {
    switch (action.type) {
      case CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES_SUCCESS:
        return {
          ...state,
          notes: action.payload || ''
        }
      case CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION:
        return {
          ...state,
          version: action.payload || ''
        }
      default:
        return state
    }
  }
}