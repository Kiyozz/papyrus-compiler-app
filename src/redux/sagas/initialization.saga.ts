import { take, put, select, race } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import {
  actionInitializationFailed,
  actionInitializationRestoreSettings,
  actionInitializationSuccess,
  actionDetectMo2SourcesFolders
} from '../actions'
import { RootStore } from '../stores/root.store'
import { SettingsState } from '../reducers/settings.reducer'

export default function* initializationSaga() {
  while (true) {
    try {
      yield take(CONSTANTS.APP_INITIALIZATION)
      yield put(actionInitializationRestoreSettings())

      const { mo2Instance, game }: SettingsState = yield select((state: RootStore) => state.settings)

      if (mo2Instance && game) {
        yield put(actionDetectMo2SourcesFolders([mo2Instance, game]))
        yield race([
          take(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS),
          take(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED)
        ])
      }

      yield put(actionInitializationSuccess())
    } catch (e) {
      yield put(actionInitializationFailed(e))
    }
  }
}
