import { put, race, select, take } from 'redux-saga/effects'
import {
  actionDetectMo2SourcesFolders,
  actionInitializationFailed,
  actionInitializationRestoreSettings,
  actionInitializationSuccess
} from '../actions'
import * as CONSTANTS from '../actions/constants'
import { SettingsState } from '../reducers/settings.reducer'
import { RootStore } from '../stores/root.store'

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
