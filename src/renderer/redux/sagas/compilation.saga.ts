/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { AnyAction } from 'redux'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { ScriptInterface } from '../../interfaces'
import actions, { CONSTANTS } from '../actions'
import { apiFactory } from '../api/api-factory'
import { CompilationResultInterface } from '../../../common/interfaces/compilation-result.interface'

function chunk(scripts: ScriptInterface[], size: number): ScriptInterface[][] {
  return scripts.reduce(
    (acc: ScriptInterface[][], current: ScriptInterface, i: number) => {
      if (!(i % size)) {
        acc.push(scripts.slice(i, i + size))
      }

      return acc
    },
    []
  )
}

function* whenCompileScriptFinish(script: ScriptInterface) {
  const api = apiFactory()

  try {
    const result: CompilationResultInterface = yield api.whenCompileScript(
      script.name
    )

    yield put(
      actions.compilationPage.compilation.script.success([
        script,
        result.output
      ])
    )
  } catch (e) {
    yield put(
      actions.compilationPage.compilation.script.failed([script, e.message])
    )
  }
}

function* compileScript(scripts: ScriptInterface[]) {
  const api = apiFactory()

  for (const script of scripts) {
    yield put(actions.compilationPage.compilation.script.start(script))
  }

  yield call(api.sendCompileScript, scripts)

  yield all(
    scripts.map((script: ScriptInterface) => {
      return call(whenCompileScriptFinish, script)
    })
  )
}

function* startCompilation(action: AnyAction) {
  const {
    allScripts,
    concurrentScripts
  }: {
    allScripts: ScriptInterface[]
    concurrentScripts: number
  } = action.payload

  console.log('Starting compilation for', allScripts)

  const scriptsOfScripts = chunk(
    allScripts,
    (concurrentScripts ?? 0) === 0 ? 1 : concurrentScripts
  )

  for (const scripts of scriptsOfScripts) {
    yield call(compileScript, scripts)
  }

  yield put(actions.compilationPage.compilation.finish())
}

export default function* compilationSaga() {
  yield takeLatest(
    CONSTANTS.APP_COMPILATION_START_COMPILATION,
    startCompilation
  )
}
