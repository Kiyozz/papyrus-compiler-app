/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import debounce from 'debounce-fn'
import React from 'react'
import { render } from 'react-dom'
import App from './app'
import bridge from './bridge'
import AppProvider from './hooks/use-app'
import CompilationProvider from './hooks/use-compilation'
import DrawerProvider from './hooks/use-drawer'
import DropProvider from './hooks/use-drop'
import FocusProvider from './hooks/use-focus'
import InitializationProvider from './hooks/use-initialization'
import RecentFilesProvider from './hooks/use-recent-files'
import TelemetryProvider from './hooks/use-telemetry'
import VersionProvider from './hooks/use-version'
import MuiTheme from './mui-theme'
import SettingsProvider from './pages/settings/use-settings'
import { loadTranslations } from './translations'
import { isProduction } from './utils/is-production'

function start() {
  loadTranslations()

  try {
    render(
      <VersionProvider>
        <AppProvider>
          <TelemetryProvider>
            <InitializationProvider>
              <RecentFilesProvider>
                <CompilationProvider>
                  <SettingsProvider>
                    <FocusProvider>
                      <MuiTheme>
                        <DrawerProvider>
                          <DropProvider>
                            <App />
                          </DropProvider>
                        </DrawerProvider>
                      </MuiTheme>
                    </FocusProvider>
                  </SettingsProvider>
                </CompilationProvider>
              </RecentFilesProvider>
            </InitializationProvider>
          </TelemetryProvider>
        </AppProvider>
      </VersionProvider>,
      document.getElementById('app'),
    )
  } catch (e) {
    let err: Error

    if (e instanceof Error) {
      err = e
    } else if (typeof e === 'string') {
      err = new Error(e)
    } else {
      err = new Error(`unknown error: ${e}`)
    }

    bridge.error(err)
  }

  function sendIsOnline(): void {
    bridge.online(navigator.onLine)
  }

  sendIsOnline()

  window.addEventListener('online', () => sendIsOnline())
  window.addEventListener('offline', () => sendIsOnline())

  isProduction().then(production => {
    if (!production) {
      const handle = debounce(
        (error: Error) => {
          bridge.error(error)
        },
        { wait: 200 },
      )

      window.addEventListener('error', event => {
        event.preventDefault()
        handle(event.error || event)
      })

      window.addEventListener('unhandledrejection', event => {
        event.preventDefault()
        handle(event.reason || event)
      })
    }
  })
}

start()
