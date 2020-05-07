import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import {
  actionStartCompilationFinish,
  actionStartCompilationScriptSuccess,
  actionStartCompilationScriptStart,
  actionStartCompilationScriptFailed
} from '../actions'
import { AnyAction } from 'redux'
import { ScriptModel } from '../../models'
import createApi from '../api/create-api'
import { RootStore } from '../stores/root.store'
import { SettingsState } from '../reducers/settings.reducer'

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
