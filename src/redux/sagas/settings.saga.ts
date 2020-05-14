import { AnyAction } from 'redux'
import { call, put, takeLatest } from 'redux-saga/effects'
import actions, { CONSTANTS } from '../actions'
import createApi from '../api/create-api'

function* detectFolders(action: AnyAction) {
  const api = createApi()

  try {
    yield put(actions.task.loading(true))

    const folders: string[] = yield call(api.detectMo2SourcesFolders, action.payload)

    yield put(actions.settingsPage.mo2.detectSources.success(folders))
  } catch (e) {
    yield put(actions.settingsPage.mo2.detectSources.failed(e))
  } finally {
    yield put(actions.task.loading(false))
  }
}

function* detectBadInstallation(action: AnyAction) {
  const api = createApi()

  try {
    yield put(actions.task.loading(true))

    const fileExists: boolean = yield call(api.detectBadInstallation, action.payload)

    yield put(actions.settingsPage.detectBadInstallation.success(fileExists))
  } catch (e) {
    yield put(actions.settingsPage.detectBadInstallation.failed(e))
  } finally {
    yield put(actions.task.loading(false))
  }
}

export default function* settingsSaga() {
  yield takeLatest(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS, detectFolders)
  yield takeLatest(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION, detectBadInstallation)
}
