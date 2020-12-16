/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { createHistory, createMemorySource } from '@reach/router'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { logger } from 'redux-logger'
import changelogReducer, { ChangelogState } from '../reducers/changelog.reducer'
import compilationLogsReducer, {
  CompilationLogsState
} from '../reducers/compilation-logs.reducer'
import compilationReducer, {
  CompilationState
} from '../reducers/compilation.reducer'
import initializationReducer, {
  InitializationState
} from '../reducers/initialization.reducer'
import createSettingsReducer, {
  SettingsState
} from '../reducers/settings.reducer'
import taskLoadingReducer, {
  TaskLoadingState
} from '../reducers/task-loading.reducer'
import rootSaga from '../sagas/root.saga'

export interface RootStore {
  initialization: InitializationState
  compilation: CompilationState
  compilationLogs: CompilationLogsState
  settings: SettingsState
  changelog: ChangelogState
  taskLoading: TaskLoadingState
}

const PREFIX = 'papyrus-compiler-app'

export default function createRootStore() {
  const history = createHistory(createMemorySource('/'))
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      initialization: initializationReducer,
      compilation: compilationReducer,
      compilationLogs: compilationLogsReducer,
      settings: createSettingsReducer(),
      changelog: changelogReducer(PREFIX),
      taskLoading: taskLoadingReducer
    }),
    compose(applyMiddleware(sagaMiddleware, logger))
  )

  sagaMiddleware.run(rootSaga)

  return {
    store,
    history
  }
}
