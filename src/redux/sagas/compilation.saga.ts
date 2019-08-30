import { takeLatest, put, delay } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import {
  actionStartCompilationFinish,
  actionStartCompilationScriptSuccess,
  actionStartCompilationScriptStart,
  actionStartCompilationScriptFailed
} from '../actions/compilation/compilation.actions'
import { AnyAction } from 'redux'
import { ScriptModel } from '../../models'

function* startCompilation(action: AnyAction) {
  const scripts: ScriptModel[] = action.payload

  for (const script of scripts) {
    try {
      const logs: string = yield put(actionStartCompilationScriptStart(script))

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
