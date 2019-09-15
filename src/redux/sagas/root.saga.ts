import { fork, all } from 'redux-saga/effects'
import changelogSaga from './changelog.saga'
import initializationSaga from './initialization.saga'
import compilationSaga from './compilation.saga'
import groupsSaga from './groups.saga'
import settingsSaga from './settings.saga'

export default function* rootSaga() {
  yield all([
    fork(initializationSaga),
    fork(compilationSaga),
    fork(changelogSaga),
    fork(groupsSaga),
    fork(settingsSaga)
  ])
}
