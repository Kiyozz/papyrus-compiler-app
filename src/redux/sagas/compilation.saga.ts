import { takeLatest, put, delay, call } from 'redux-saga/effects'
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

function* startCompilation(action: AnyAction) {
  const scripts: ScriptModel[] = action.payload

  for (const script of scripts) {
    try {
      yield put(actionStartCompilationScriptStart(script))

      const logs = yield call(api.compileScript, script)

      yield delay(1000)
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
