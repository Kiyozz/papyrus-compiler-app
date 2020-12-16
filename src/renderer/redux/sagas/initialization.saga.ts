/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { call, put, take } from 'redux-saga/effects'
import actions, { CONSTANTS } from '../actions'
import { apiFactory } from '../api/api-factory'

export default function* initializationSaga() {
  const api = apiFactory()

  while (true) {
    try {
      yield take(CONSTANTS.APP_INITIALIZATION_START)

      const startingVersion: string = yield call(api.getVersion)

      yield put(actions.changelog.version(startingVersion))
      yield put(actions.initialization.success())
    } catch (e) {
      yield put(actions.initialization.failed(e))
    }
  }
}
