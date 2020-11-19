import { call, put, takeLatest } from 'redux-saga/effects'
import actions, { CONSTANTS } from '../actions'
import { apiFactory } from '../api/api-factory'

function* detectFolders() {
  const api = apiFactory()

  try {
    yield put(actions.task.loading(true))

    const folders: string[] = yield call(api.detectMo2SourcesFolders)

    yield put(actions.settingsPage.mo2.detectSources.success(folders))
  } catch (e) {
    yield put(actions.settingsPage.mo2.detectSources.failed(e))
  } finally {
    yield put(actions.task.loading(false))
  }
}

function* detectBadInstallation() {
  const api = apiFactory()

  try {
    yield put(actions.task.loading(true))

    const fileExists: boolean = yield call(api.detectBadInstallation)

    yield put(actions.settingsPage.detectBadInstallation.success(fileExists))
  } catch (e) {
    yield put(actions.settingsPage.detectBadInstallation.failed(e))
  } finally {
    yield put(actions.task.loading(false))
  }
}

export default function* settingsSaga() {
  yield takeLatest(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS, detectFolders)
  yield takeLatest(
    CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION,
    detectBadInstallation
  )
}
