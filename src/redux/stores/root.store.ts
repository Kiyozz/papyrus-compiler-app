import { routerMiddleware, RouterState, connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import initializationReducer, { InitializationState } from '../reducers/initialization.reducer'
import rootSaga from '../sagas/root.saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import compilationReducer, { CompilationState } from '../reducers/compilation.reducer'
import compilationLogsReducer, { CompilationLogsState } from '../reducers/compilation-logs.reducer'
import groupsReducer, { GroupsState } from '../reducers/groups.reducer'

export interface RootStore {
  router: RouterState
  initialization: InitializationState
  compilation: CompilationState
  compilationLogs: CompilationLogsState
  groups: GroupsState
}

export const history = createBrowserHistory()

export default function createRootStore() {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      initialization: initializationReducer,
      compilation: compilationReducer,
      compilationLogs: compilationLogsReducer,
      groups: groupsReducer,
      router: connectRouter(history)
    }),
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), sagaMiddleware)
    )
  )

  sagaMiddleware.run(rootSaga)

  return store
}
