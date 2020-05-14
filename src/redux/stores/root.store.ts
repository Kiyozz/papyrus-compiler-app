import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
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
  router: RouterState
  initialization: InitializationState
  compilation: CompilationState
  compilationLogs: CompilationLogsState
  groups: GroupsState
  settings: SettingsState
  changelog: ChangelogState
  taskLoading: TaskLoadingState
}

const PREFIX = 'papyrus-compiler-app'

export default function createRootStore(history = createBrowserHistory()) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      initialization: initializationReducer,
      compilation: compilationReducer,
      compilationLogs: compilationLogsReducer,
      groups: groupsReducer,
      settings: settingsReducer,
      changelog: changelogReducer(PREFIX),
      taskLoading: taskLoadingReducer,
      router: connectRouter(history)
    }),
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
        versionMiddleware(PREFIX),
        storageMiddleware(PREFIX),
        logMiddleware
      )
    )
  )

  sagaMiddleware.run(rootSaga)

  return {
    store,
    history
  }
}
