import { take, put, delay } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import {
  actionInitializationFailed,
  actionInitializationRestoreSettings,
  actionInitializationSuccess
} from '../actions/initialization/initialization.actions'

export default function* initializationSaga() {
  while (true) {
    try {
      yield take(CONSTANTS.APP_INITIALIZATION)
      yield delay(1000)
      yield put(actionInitializationRestoreSettings())
      yield put(actionInitializationSuccess())
    } catch (e) {
      yield put(actionInitializationFailed(e))
    }
  }
}
