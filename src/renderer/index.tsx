import * as EVENTS from '@pca/common/events'
import { LocationProvider } from '@reach/router'
import { ipcRenderer } from '@pca/common/ipc'
import React from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'

import App from './app'
import { ElectronRuntimeException } from './redux/api/exceptions/electron-runtime.exception'
import createRootStore from './redux/stores/root.store'
import './translations'
import ThemeProvider from './theme'
import './index.scss'

declare global {
  interface Window {
    require: any
  }
}

if (typeof window.require === 'undefined') {
  throw new ElectronRuntimeException()
}

try {
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
} catch (e) {
  ipcRenderer.invoke(EVENTS.IN_APP_ERROR, e)
}

if (process.env.NODE_ENV === 'production') {
  window.onerror = (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ) => {
    ipcRenderer.invoke(
      EVENTS.IN_APP_ERROR,
      new Error(`From ${source}: L${lineno}C${colno}. ERROR: ${error}`)
    )
  }
}
