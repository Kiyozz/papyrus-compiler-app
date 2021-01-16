/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { LocationProvider } from '@reach/router'
import React from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { ipcRenderer } from '../common/ipc'
import * as EVENTS from '../common/events'

import { App } from './app'
import { ElectronRuntimeException } from './redux/api/exceptions/electron-runtime.exception'
import createRootStore from './redux/stores/root.store'
import './translations'
import { Theme } from './theme'
import { isProduction } from './utils/is-production'

declare global {
  interface Window {
    require: any
  }
}

if (typeof window.require === 'undefined') {
  throw new ElectronRuntimeException()
}

async function start() {
  try {
    const { store, history } = await createRootStore()

    render(
      <ReduxProvider store={store}>
        <Theme>
          <LocationProvider history={history}>
            <App />
          </LocationProvider>
        </Theme>
      </ReduxProvider>,
      document.getElementById('app')
    )
  } catch (e) {
    ipcRenderer.invoke(EVENTS.ERROR, e)
  }

  isProduction().then(production => {
    if (production) {
      window.onerror = (
        event: Event | string,
        source?: string,
        lineno?: number,
        colno?: number,
        error?: Error
      ) => {
        ipcRenderer.invoke(
          EVENTS.ERROR,
          new Error(`From ${source}: L${lineno}C${colno}. ERROR: ${error}`)
        )
      }
    }
  })
}

start()
