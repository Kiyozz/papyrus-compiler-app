import { takeLatest, call, put } from 'redux-saga/effects'
import { GithubReleaseModel } from '../../models'
import {
  actionGetLatestNotesFailed,
  actionGetLatestNotesSuccess
} from '../actions/changelog/changelog.actions'
import * as CONSTANTS from '../actions/constants'
import createApi from '../api/create-api'

function* getLatestRelease() {
  const api = createApi()

  try {
    const startingVersion = process.env.REACT_APP_VERSION || ''
    const releases: GithubReleaseModel[] = yield call(api.getLatestNotes)
    const release = releases.find((release) => release.tag_name === startingVersion)

    if (!release) {
      yield put(actionGetLatestNotesFailed(new Error(`Version ${startingVersion} not found.`)))

      return
    }

    yield put(actionGetLatestNotesSuccess(release.body))
  } catch (e) {
    yield put(actionGetLatestNotesFailed(e))
  }
}

export default function* changelogSaga() {
  yield takeLatest(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES, getLatestRelease)
}
