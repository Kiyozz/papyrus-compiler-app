import compareVersions from 'compare-versions'
import { takeLatest, call, put, race, delay, select } from 'redux-saga/effects'
import { GithubReleaseModel } from '../../models'
import {
  actionGetLatestNotesFailed,
  actionGetLatestNotesSuccess, actionSetLatestVersion, actionSetShowNotes
} from '../actions/changelog/changelog.actions'
import * as CONSTANTS from '../actions/constants'
import createApi from '../api/create-api'
import { RootStore } from '../stores/root.store'

function* getLatestRelease() {
  const api = createApi()

  try {
    const result: [GithubReleaseModel[] | undefined, boolean | undefined] = yield race([
      call(api.getLatestNotes),
      delay(5000)
    ])

    if (typeof result[1] === 'undefined' && typeof result[0] !== 'undefined') {
      const [ release ] = result[0] as [GithubReleaseModel]
      const startingVersion: string = yield select((state: RootStore) => state.changelog.startingVersion)

      if (typeof release !== 'undefined') {
        if (compareVersions.compare(release.tag_name, startingVersion, '>')) {
          yield put(actionSetLatestVersion(release.tag_name))
          yield put(actionSetShowNotes(true))
          yield put(actionGetLatestNotesSuccess(release.body))
        } else {
          yield put(actionSetShowNotes(false))
        }

        return
      }

      yield put(actionGetLatestNotesFailed(new Error(`Version ${startingVersion} not found.`)))
    }
  } catch (e) {
    yield put(actionGetLatestNotesFailed(e))
  }
}

export default function* changelogSaga() {
  yield takeLatest(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES, getLatestRelease)
}
