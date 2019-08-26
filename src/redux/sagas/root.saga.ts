import { fork, all } from 'redux-saga/effects'
import initializationSaga from './initialization.saga'

export default function* rootSaga() {
  yield all([
    fork(initializationSaga)
  ])
}
