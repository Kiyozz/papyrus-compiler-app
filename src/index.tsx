import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './app'
import './index.scss'
import createRootStore, { RootStoreProvider } from './redux/stores/root.store'
import * as serviceWorker from './serviceWorker'
import Theme from './theme'

declare global {
  interface Window {
    require: any
  }
}

const { store, history } = createRootStore()

render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <RootStoreProvider>
        <Theme>
          <App />
        </Theme>
      </RootStoreProvider>
    </ConnectedRouter>
  </Provider>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
