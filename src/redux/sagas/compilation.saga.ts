import { takeLatest, put, call, select } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import {
  actionStartCompilationFinish,
  actionStartCompilationScriptSuccess,
  actionStartCompilationScriptStart,
  actionStartCompilationScriptFailed
} from '../actions/compilation/compilation.actions'
import { AnyAction } from 'redux'
import { ScriptModel } from '../../models'
import api from '../api/api'
import { RootStore } from '../stores/root.store'
import { SettingsState } from '../reducers/settings.reducer'

function* startCompilation(action: AnyAction) {
  const scripts: ScriptModel[] = action.payload
  const { game, gameFolder }: SettingsState = yield select((store: RootStore) => store.settings)

  console.log('Starting compilation for', scripts)

  for (const script of scripts) {
    try {
      yield put(actionStartCompilationScriptStart(script))

      const logs: string = yield call(api.compileScript, script, [game, gameFolder])

      yield put(actionStartCompilationScriptSuccess([script, logs]))
    } catch (e) {
      yield put(actionStartCompilationScriptFailed([script, e.message]))
    }
  }

  yield put(actionStartCompilationFinish())
}

export default function* compilationSaga() {
  yield takeLatest(CONSTANTS.APP_COMPILATION_START_COMPILATION, startCompilation)
}
