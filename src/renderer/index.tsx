/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import {
  createHistory,
  createMemorySource,
  LocationProvider
} from '@reach/router'
import React from 'react'
import { render } from 'react-dom'
import { Titlebar, Color } from 'custom-electron-titlebar'
import { ipcRenderer } from '../common/ipc'
import { Events } from '../common/events'

import { App } from './app'
import './translations'
import { Theme } from './theme'
import { isProduction } from './utils/is-production'
import appIcon from './assets/logo/vector/isolated-layout.svg'
import { AppProvider } from './hooks/use-app'
import { CompilationProvider } from './hooks/use-compilation'
import { SettingsProvider } from './pages/settings/settings-context'

function start() {
  const titlebar = new Titlebar({
    backgroundColor: Color.fromHex('#5b21b6'),
    icon: appIcon
  })

  try {
    const history = createHistory(createMemorySource('/'))

    render(
      <Theme>
        <LocationProvider history={history}>
          <AppProvider titlebar={titlebar}>
            <CompilationProvider>
              <SettingsProvider>
                <App />
              </SettingsProvider>
            </CompilationProvider>
          </AppProvider>
        </LocationProvider>
      </Theme>,
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
