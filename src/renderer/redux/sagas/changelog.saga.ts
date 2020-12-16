/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import compareVersions from 'compare-versions'
import {
  call,
  delay,
  put,
  race,
  select,
  take,
  takeLatest
} from 'redux-saga/effects'
import { GithubReleaseModel } from '../../models'
import actions, { CONSTANTS } from '../actions'
import { apiFactory } from '../api/api-factory'
import { RootStore } from '../stores/root.store'

function* getLatestRelease() {
  const api = apiFactory()

  yield take(CONSTANTS.APP_INITIALIZATION_SUCCESS)

  const version = yield select((store: RootStore) => store.changelog.version)

  try {
    const result: [
      GithubReleaseModel[] | undefined,
      boolean | undefined
    ] = yield race([call(api.getLatestNotes), delay(5000)])

    if (typeof result[1] === 'undefined' && typeof result[0] !== 'undefined') {
      const [release] = result[0] as [GithubReleaseModel]

      if (typeof release !== 'undefined') {
        if (compareVersions.compare(release.tag_name, version, '>')) {
          yield put(actions.changelog.latestVersion(release.tag_name))
          yield put(actions.changelog.showNotes(true))
          yield put(actions.changelog.latestNotes.success(release.body))
        } else {
          yield put(actions.changelog.showNotes(false))
        }

        return
      }

      yield put(
        actions.changelog.latestNotes.failed(
          new Error(`Version ${version} not found.`)
        )
      )
    }
  } catch (e) {
    yield put(actions.changelog.latestNotes.failed(e))
  }
}

export default function* changelogSaga() {
  yield takeLatest(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES, getLatestRelease)
}
