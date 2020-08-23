import { AnyAction } from 'redux'
import { CONSTANTS } from '../actions'

export interface ChangelogState {
  notes: string
  latestVersion: string
  version: string
  showNotes: boolean
}

export default function createChangeLogReducer(prefix: string) {
  const showNotesSaved = (localStorage.getItem(`${prefix}/${CONSTANTS.APP_CHANGELOG_SET_SHOW_NOTES}`) ?? 'false') === 'true'

  const initialState: ChangelogState = {
    notes: '',
    showNotes: showNotesSaved,
    version: '',
    latestVersion: ''
  }

  return function changelogReducer(state = initialState, action: AnyAction): ChangelogState {
    switch (action.type) {
      case CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES_SUCCESS:
        return {
          ...state,
          notes: action.payload || ''
        }
      case CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES_FAILED:
        return {
          ...state,
          notes: '',
          showNotes: false
        }
      case CONSTANTS.APP_CHANGELOG_SET_SHOW_NOTES:
        return {
          ...state,
          showNotes: action.payload ?? false
        }
      case CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION:
        return {
          ...state,
          latestVersion: action.payload ?? ''
        }
      case CONSTANTS.APP_CHANGELOG_SET_VERSION:
        return {
          ...state,
          version: action.payload ?? ''
        }
      default:
        return state
    }
  }
}
