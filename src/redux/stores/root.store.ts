import { routerMiddleware, RouterState, connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import versionMiddleware from '../middlewares/changelog/version.middleware'
import changelogReducer, { ChangelogState } from '../reducers/changelog.reducer'
import initializationReducer, { InitializationState } from '../reducers/initialization.reducer'
import rootSaga from '../sagas/root.saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import compilationReducer, { CompilationState } from '../reducers/compilation.reducer'
import compilationLogsReducer, { CompilationLogsState } from '../reducers/compilation-logs.reducer'
import groupsReducer, { GroupsState } from '../reducers/groups.reducer'
import settingsReducer, { SettingsState } from '../reducers/settings.reducer'
import storageMiddleware from '../middlewares/storage/storage.middleware'
import logMiddleware from '../middlewares/log/log.middleware'
import taskLoadingReducer, { TaskLoadingState } from '../reducers/task-loading.reducer'
import errorReducer, { ErrorState } from '../reducers/error.reducer'

export interface RootStore {
  router: RouterState
  initialization: InitializationState
  compilation: CompilationState
  compilationLogs: CompilationLogsState
  groups: GroupsState
  settings: SettingsState
  changelog: ChangelogState
  taskLoading: TaskLoadingState
  error: ErrorState
}

export default function createRootStore(history = createBrowserHistory()) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      initialization: initializationReducer,
      compilation: compilationReducer,
      compilationLogs: compilationLogsReducer,
      groups: groupsReducer,
      settings: settingsReducer,
      changelog: changelogReducer('papyrus-compiler-app'),
      taskLoading: taskLoadingReducer,
      error: errorReducer,
      router: connectRouter(history)
    }),
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
        versionMiddleware('papyrus-compiler-app'),
        storageMiddleware('papyrus-compiler-app'),
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
