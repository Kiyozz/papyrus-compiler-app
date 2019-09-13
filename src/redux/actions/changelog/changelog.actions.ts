import { createAction } from 'redux-actions'
import * as CONSTANTS from '../constants'

export const actionSetLatestVersion = createAction<string>(CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION)
export const actionGetLatestNotes = createAction(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES)
export const actionGetLatestNotesSuccess = createAction<string>(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES_SUCCESS)
export const actionGetLatestNotesFailed = createAction<Error>(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES_FAILED)
