import { put, race, select, take } from 'redux-saga/effects'
import actions, { CONSTANTS } from '../actions'
import { SettingsState } from '../reducers/settings.reducer'
import { RootStore } from '../stores/root.store'

export default function* initializationSaga() {
  while (true) {
    try {
      yield take(CONSTANTS.APP_INITIALIZATION_START)
      yield put(actions.settingsPage.restore())

      const { mo2Instance, game }: SettingsState = yield select((state: RootStore) => state.settings)

      if (mo2Instance && game) {
        yield put(actions.settingsPage.mo2.detectSources.start([mo2Instance, game]))
        yield race([take(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS), take(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED)])
      }

      yield put(actions.initialization.success())
    } catch (e) {
      yield put(actions.initialization.failed(e))
    }
  }
}
