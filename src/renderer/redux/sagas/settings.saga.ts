/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { call, put, takeLatest } from 'redux-saga/effects'
import actions, { CONSTANTS } from '../actions'
import { apiFactory } from '../api/api-factory'

function* detectBadInstallation() {
  const api = apiFactory()

  try {
    yield put(actions.task.loading(true))

    const fileExists: boolean = yield call(api.detectBadInstallation)

    yield put(actions.settingsPage.detectBadInstallation.success(fileExists))
  } catch (e) {
    yield put(actions.settingsPage.detectBadInstallation.failed(e))
  } finally {
    yield put(actions.task.loading(false))
  }
}

export default function* settingsSaga() {
  yield takeLatest(
    CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION,
    detectBadInstallation
  )
}
