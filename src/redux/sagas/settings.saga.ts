import { takeLatest, put, call } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import * as ACTIONS from '../actions/settings/settings.actions'
import createApi from '../api/create-api'
import { AnyAction } from 'redux'
import { actionSetTaskLoading } from '../actions'

function* detectFolders(action: AnyAction) {
  const api = createApi()

  try {
    yield put(actionSetTaskLoading(true))

    const files: string[] = yield call(api.detectMo2SourcesFolders, action.payload)

    yield put(ACTIONS.actionDetectMo2SourcesFoldersSuccess(files))
  } catch (e) {
    yield put(ACTIONS.actionDetectMo2SourcesFoldersFailed(e))
  } finally {
    yield put(actionSetTaskLoading(false))
  }
}

function* detectBadInstallation(action: AnyAction) {
  const api = createApi()

  try {
    yield put(actionSetTaskLoading(true))

    const fileExists: boolean = yield call(api.detectBadInstallation, action.payload)

    yield put(ACTIONS.actionDetectBadInstallationSuccess(fileExists))
  } catch (e) {
    yield put(ACTIONS.actionDetectBadInstallationFailed(e))
  } finally {
    yield put(actionSetTaskLoading(false))
  }
}

export default function* settingsSaga() {
  yield takeLatest(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS, detectFolders)
  yield takeLatest(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION, detectBadInstallation)
}
