import { routerMiddleware, RouterState, connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import initializationReducer, { InitializationState } from '../reducers/initialization.reducer'
import rootSaga from '../sagas/root.saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import compilationReducer, { CompilationState } from '../reducers/compilation.reducer'

export interface RootStore {
  router: RouterState
  initialization: InitializationState
  compilation: CompilationState
}

export const history = createBrowserHistory()

export default function createRootStore() {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      initialization: initializationReducer,
      compilation: compilationReducer,
      router: connectRouter(history)
    }),
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), sagaMiddleware)
    )
  )

  sagaMiddleware.run(rootSaga)

  return store
}
