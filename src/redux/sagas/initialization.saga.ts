import { take, put, delay } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import {
  actionInitializationFailed,
  actionInitializationSuccess
} from '../actions/initialization/initialization.actions'

export default function* initializationSaga() {
  while (true) {
    try {
      yield take(CONSTANTS.APP_INITIALIZATION)
      yield delay(1000)
      yield put(actionInitializationSuccess())
    } catch (e) {
      yield put(actionInitializationFailed(e))
    }
  }
}
