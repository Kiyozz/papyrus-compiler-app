/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import debounce from 'debounce-fn'
import React from 'react'
import { render } from 'react-dom'

import { App } from './app'
import './translations'
import bridge from './bridge'
import { AppProvider } from './hooks/use-app'
import { CompilationProvider } from './hooks/use-compilation'
import { DrawerProvider } from './hooks/use-drawer'
import { DropProvider } from './hooks/use-drop'
import { FocusProvider } from './hooks/use-focus'
import { InitializationProvider } from './hooks/use-initialization'
import { TelemetryProvider } from './hooks/use-telemetry'
import { VersionProvider } from './hooks/use-version'
import { SettingsProvider } from './pages/settings/settings-context'
import { Theme } from './theme'
import { isProduction } from './utils/is-production'

function start() {
  try {
    render(
      <VersionProvider>
        <AppProvider>
          <InitializationProvider>
            <CompilationProvider>
              <SettingsProvider>
                <FocusProvider>
                  <Theme>
                    <TelemetryProvider>
                      <DrawerProvider>
                        <DropProvider>
                          <App />
                        </DropProvider>
                      </DrawerProvider>
                    </TelemetryProvider>
                  </Theme>
                </FocusProvider>
              </SettingsProvider>
            </CompilationProvider>
          </InitializationProvider>
        </AppProvider>
      </VersionProvider>,
      document.getElementById('app')
    )
  } catch (e) {
    bridge.error(e instanceof Error ? e : new Error(e))
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
        { wait: 200 }
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
