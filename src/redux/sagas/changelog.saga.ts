import { takeLatest, call, put } from 'redux-saga/effects'
import { GithubReleaseModel } from '../../models'
import {
  actionGetLatestNotesFailed,
  actionGetLatestNotesSuccess,
  actionSetLatestVersion
} from '../actions/changelog/changelog.actions'
import * as CONSTANTS from '../actions/constants'
import api from '../api/api'

function* getLatestRelease() {
  try {
    const release: GithubReleaseModel = yield call(api.getLatestNotes)

    yield put(actionSetLatestVersion(release.tag_name))
    yield put(actionGetLatestNotesSuccess(release.body))
  } catch (e) {
    yield put(actionGetLatestNotesFailed(e))
  }
}

export default function* changelogSaga() {
  yield takeLatest(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES, getLatestRelease)
}
