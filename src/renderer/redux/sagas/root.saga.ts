import { all, call, fork, takeLatest } from 'redux-saga/effects'
import { CONSTANTS } from '../actions'
import changelogSaga from './changelog.saga'
import compilationSaga from './compilation.saga'
import groupsSaga from './groups.saga'
import initializationSaga from './initialization.saga'
import settingsSaga from './settings.saga'
import createApi from '../api/create-api'

function* openLogFile() {
  const api = createApi()

  yield takeLatest(CONSTANTS.APP_LOG_OPEN, function* () {
    yield call(api.openLogFile)
  })
}

export default function* rootSaga() {
  yield fork(openLogFile)
  yield all([
    fork(initializationSaga),
    fork(compilationSaga),
    fork(changelogSaga),
    fork(groupsSaga),
    fork(settingsSaga)
  ])
}
