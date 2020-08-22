import { LocationProvider } from '@reach/router'
import React from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'

import App from './app'
import './index.scss'
import { ElectronRuntimeException } from './redux/api/exceptions/electron-runtime.exception'
import createRootStore from './redux/stores/root.store'
import './translations'
import ThemeProvider from './theme'

declare global {
  interface Window {
    require: any
  }
}

if (typeof window.require === 'undefined') {
  throw new ElectronRuntimeException()
}

const { store, history } = createRootStore()

render(
  <ReduxProvider store={store}>
    <ThemeProvider>
      <LocationProvider history={history}>
        <App />
      </LocationProvider>
    </ThemeProvider>
  </ReduxProvider>,
  document.getElementById('app')
)
