/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { all, fork } from 'redux-saga/effects'
import changelogSaga from './changelog.saga'
import compilationSaga from './compilation.saga'
import initializationSaga from './initialization.saga'
import settingsSaga from './settings.saga'

export default function* rootSaga() {
  yield all([
    fork(initializationSaga),
    fork(compilationSaga),
    fork(changelogSaga),
    fork(settingsSaga)
  ])
}
