import { createHistory, createMemorySource } from '@reach/router'
import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import versionMiddleware from '../middlewares/changelog/version.middleware'
import logMiddleware from '../middlewares/log/log.middleware'
import storageMiddleware from '../middlewares/storage/storage.middleware'
import changelogReducer, { ChangelogState } from '../reducers/changelog.reducer'
import compilationLogsReducer, { CompilationLogsState } from '../reducers/compilation-logs.reducer'
import compilationReducer, { CompilationState } from '../reducers/compilation.reducer'
import groupsReducer, { GroupsState } from '../reducers/groups.reducer'
import initializationReducer, { InitializationState } from '../reducers/initialization.reducer'
import settingsReducer, { SettingsState } from '../reducers/settings.reducer'
import taskLoadingReducer, { TaskLoadingState } from '../reducers/task-loading.reducer'
import rootSaga from '../sagas/root.saga'

export interface RootStore {
  initialization: InitializationState
  compilation: CompilationState
  compilationLogs: CompilationLogsState
  groups: GroupsState
  settings: SettingsState
  changelog: ChangelogState
  taskLoading: TaskLoadingState
}

const PREFIX = 'papyrus-compiler-app'

export default function createRootStore(history = createHistory(createMemorySource('/'))) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      initialization: initializationReducer,
      compilation: compilationReducer,
      compilationLogs: compilationLogsReducer,
      groups: groupsReducer,
      settings: settingsReducer,
      changelog: changelogReducer(PREFIX),
      taskLoading: taskLoadingReducer
    }),
    compose(applyMiddleware(sagaMiddleware, versionMiddleware(PREFIX), storageMiddleware(PREFIX), logMiddleware))
  )

  sagaMiddleware.run(rootSaga)

  return {
    store,
    history
  }
}
