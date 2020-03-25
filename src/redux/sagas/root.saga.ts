import { fork, all, takeLatest, call } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import changelogSaga from './changelog.saga'
import initializationSaga from './initialization.saga'
import compilationSaga from './compilation.saga'
import groupsSaga from './groups.saga'
import settingsSaga from './settings.saga'

function* openLogFile() {
  const { shell } = window.require('electron')
  const log = window.require('electron-log')

  yield takeLatest(CONSTANTS.APP_LOG_OPEN, function* () {
    yield call(() => shell.openExternal(log.transports.file.findLogPath()))
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
