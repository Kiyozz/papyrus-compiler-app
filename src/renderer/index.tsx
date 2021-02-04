/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { LocationProvider } from '@reach/router'
import React from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { Titlebar, Color } from 'custom-electron-titlebar'
import { ipcRenderer } from '../common/ipc'
import * as Events from '../common/events'

import { App } from './app'
import createRootStore from './redux/stores/root.store'
import './translations'
import { Theme } from './theme'
import { isProduction } from './utils/is-production'
import appIcon from './assets/logo/vector/isolated-layout.svg'

async function start() {
  new Titlebar({
    backgroundColor: Color.fromHex('#5b21b6'),
    icon: appIcon
  })

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
    ipcRenderer.invoke(Events.AppError, e)
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
          Events.AppError,
          new Error(`From ${source}: L${lineno}C${colno}. ERROR: ${error}`)
        )
      }
    }
  })
}

start()
