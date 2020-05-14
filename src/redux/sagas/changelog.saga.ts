import compareVersions from 'compare-versions'
import { call, delay, put, race, select, takeLatest } from 'redux-saga/effects'
import { GithubReleaseModel } from '../../models'
import actions, { CONSTANTS } from '../actions'
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
          yield put(actions.changelog.latestVersion(release.tag_name))
          yield put(actions.changelog.showNotes(true))
          yield put(actions.changelog.latestNotes.success(release.body))
        } else {
          yield put(actions.changelog.showNotes(false))
        }

        return
      }

      yield put(actions.changelog.latestNotes.failed(new Error(`Version ${startingVersion} not found.`)))
    }
  } catch (e) {
    yield put(actions.changelog.latestNotes.failed(e))
  }
}

export default function* changelogSaga() {
  yield takeLatest(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES, getLatestRelease)
}
