import { AnyAction } from 'redux'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { ScriptModel } from '../../models'
import {
  actionStartCompilationFinish,
  actionStartCompilationScriptFailed,
  actionStartCompilationScriptStart,
  actionStartCompilationScriptSuccess
} from '../actions'
import * as CONSTANTS from '../actions/constants'
import createApi from '../api/create-api'
import { SettingsState } from '../reducers/settings.reducer'
import { RootStore } from '../stores/root.store'

function* startCompilation(action: AnyAction) {
  const api = createApi()
  const scripts: ScriptModel[] = action.payload
  const { game, gameFolder, mo2Instance, mo2SourcesFolders }: SettingsState = yield select((store: RootStore) => store.settings)

  console.log('Starting compilation for', scripts)

  for (const script of scripts) {
    try {
      yield put(actionStartCompilationScriptStart(script))

      const logs: string = yield call(api.compileScript, script, [
        game,
        gameFolder,
        mo2Instance,
        mo2SourcesFolders
      ])

      yield put(actionStartCompilationScriptSuccess([script, logs]))
    } catch (e) {
      let err = e

      if (err.hasOwnProperty('message')) {
        err = err.message
      }

      yield put(actionStartCompilationScriptFailed([script, err]))
    }
  }

  yield put(actionStartCompilationFinish())
}

export default function* compilationSaga() {
  yield takeLatest(CONSTANTS.APP_COMPILATION_START_COMPILATION, startCompilation)
}
