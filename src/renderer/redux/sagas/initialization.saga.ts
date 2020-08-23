import { call, put, take } from 'redux-saga/effects'
import actions, { CONSTANTS } from '../actions'
import apiFactory from '../api/api-factory'
// import { SettingsState } from '../reducers/settings.reducer'
// import { RootStore } from '../stores/root.store'

export default function* initializationSaga() {
  const api = apiFactory()

  while (true) {
    try {
      yield take(CONSTANTS.APP_INITIALIZATION_START)

      const startingVersion: string = yield call(api.getVersion)

      yield put(actions.changelog.version(startingVersion))

      /*const { gameType, mo2 }: SettingsState = yield select((state: RootStore) => state.settings)

      if (mo2.instance && gameType) {
        yield put(actions.settingsPage.mo2.detectSources.start([mo2.instance, gameType]))
        yield race([take(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS), take(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED)])
      }*/

      yield put(actions.initialization.success())
    } catch (e) {
      yield put(actions.initialization.failed(e))
    }
  }
}
