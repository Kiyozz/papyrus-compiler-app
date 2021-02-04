/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { createHistory, createMemorySource } from '@reach/router'
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware
} from 'redux'
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
import { isProduction } from '../../utils/is-production'
import { ipcRenderer } from '../../../common/ipc'
import * as Events from '../../../common/events'
import actions from '../actions'

export interface RootStore {
  initialization: InitializationState
  compilation: CompilationState
  compilationLogs: CompilationLogsState
  settings: SettingsState
  changelog: ChangelogState
  taskLoading: TaskLoadingState
}

const PREFIX = 'papyrus-compiler-app'

export default async function createRootStore() {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares: Middleware[] = [sagaMiddleware]

  if (!(await isProduction())) {
    middlewares.push(logger)
  }

  const history = createHistory(createMemorySource('/'))
  const store = createStore(
    combineReducers({
      initialization: initializationReducer,
      compilation: compilationReducer,
      compilationLogs: compilationLogsReducer,
      settings: createSettingsReducer(PREFIX),
      changelog: changelogReducer(PREFIX),
      taskLoading: taskLoadingReducer
    }),
    compose(applyMiddleware(...middlewares))
  )

  sagaMiddleware.run(rootSaga)

  ipcRenderer.on(Events.Changelog, () => {
    store.dispatch(actions.changelog.latestNotes.start())
  })

  return {
    store,
    history
  }
}
