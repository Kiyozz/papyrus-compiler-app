/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { AnyAction } from 'redux'
import { call, put, takeLatest } from 'redux-saga/effects'
import { ScriptInterface } from '../../interfaces'
import actions, { CONSTANTS } from '../actions'
import { apiFactory } from '../api/api-factory'

function* startCompilation(action: AnyAction) {
  const api = apiFactory()
  const scripts: ScriptInterface[] = action.payload

  console.log('Starting compilation for', scripts)

  for (const script of scripts) {
    try {
      yield put(actions.compilationPage.compilation.script.start(script))

      const logs: string = yield call(api.compileScript, script)

      yield put(
        actions.compilationPage.compilation.script.success([script, logs])
      )
    } catch (e) {
      let err = e

      if (err.hasOwnProperty('message')) {
        err = err.message
      }

      yield put(
        actions.compilationPage.compilation.script.failed([script, err])
      )
    }
  }

  yield put(actions.compilationPage.compilation.finish())
}

export default function* compilationSaga() {
  yield takeLatest(
    CONSTANTS.APP_COMPILATION_START_COMPILATION,
    startCompilation
  )
}
