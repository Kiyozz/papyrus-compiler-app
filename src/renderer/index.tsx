/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import debounce from 'debounce-fn'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { fromError } from '../common/from-error'
import App from './app'
import { bridge } from './bridge'
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

async function start() {
  const root = document.getElementById('app')

  if (!root) {
    throw new Error('Something went wrong. #app element is missing.')
  }

  const rootReact = createRoot(root)

  loadTranslations()

  try {
    rootReact.render(
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
    )
  } catch (e) {
    let err: Error

    if (e instanceof Error) {
      err = e
    } else if (typeof e === 'string') {
      err = new Error(e)
    } else {
      err = new Error(`unknown error: ${fromError(e).message}`)
    }

    await bridge.error(err)
  }

  function sendIsOnline(): void {
    bridge.online(navigator.onLine)
  }

  sendIsOnline()

  window.addEventListener('online', () => sendIsOnline())
  window.addEventListener('offline', () => sendIsOnline())

  const production = await isProduction()

  if (!production) {
    const handle = debounce(
      (error: Error) => {
        void bridge.error(error)
      },
      { wait: 200 },
    )

    window.addEventListener('error', event => {
      event.preventDefault()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      handle(event.error || event)
    })

    window.addEventListener('unhandledrejection', event => {
      event.preventDefault()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      handle(event.reason || event)
    })
  }
}

void start()
