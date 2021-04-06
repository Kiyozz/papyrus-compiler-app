/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Titlebar } from 'custom-electron-titlebar'
import debounce from 'debounce-fn'
import React from 'react'
import { render } from 'react-dom'

import { Events } from '../common/events'
import { ipcRenderer } from '../common/ipc'
import { App } from './app'
import './translations'
import appIcon from './assets/logo/vector/isolated-layout.svg'
import { AppProvider } from './hooks/use-app'
import { CompilationProvider } from './hooks/use-compilation'
import { DrawerProvider } from './hooks/use-drawer'
import { DropProvider } from './hooks/use-drop'
import { FocusProvider } from './hooks/use-focus'
import { InitializationProvider } from './hooks/use-initialization'
import { TelemetryProvider } from './hooks/use-telemetry'
import { TitlebarProvider } from './hooks/use-titlebar'
import { VersionProvider } from './hooks/use-version'
import { SettingsProvider } from './pages/settings/settings-context'
import { Theme } from './theme'
import { darkColor, lightColor } from './utils/color'
import { isDark } from './utils/dark'
import { isProduction } from './utils/is-production'

function start() {
  const titlebar = new Titlebar({
    backgroundColor: isDark() ? darkColor : lightColor,
    icon: appIcon,
    unfocusEffect: false
  })

  try {
    render(
      <VersionProvider>
        <TitlebarProvider titlebar={titlebar}>
          <AppProvider titlebar={titlebar}>
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
        </TitlebarProvider>
      </VersionProvider>,
      document.getElementById('app')
    )
  } catch (e) {
    ipcRenderer.invoke(Events.AppError, e instanceof Error ? e : new Error(e))
  }

  function sendIsOnline(event: Events): void {
    ipcRenderer.send(event, { online: navigator.onLine })
  }

  sendIsOnline(Events.Online)

  window.addEventListener('online', () => sendIsOnline(Events.Online))
  window.addEventListener('offline', () => sendIsOnline(Events.Online))

  isProduction().then(production => {
    if (!production) {
      const handle = debounce(
        (error: Error) => {
          ipcRenderer.invoke(Events.AppError, error)
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
