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
import { Color, Titlebar } from 'custom-electron-titlebar'
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
import { FocusProvider } from './hooks/use-focus'
import { TelemetryProvider } from './hooks/use-telemetry'
import { SettingsProvider } from './pages/settings/settings-context'
import { Theme } from './theme'
import { isDark, onDarkPreferenceChanges } from './utils/dark'
import { isProduction } from './utils/is-production'

function start() {
  const darkColor = Color.fromHex('#282425')
  const darkColorUnfocus = Color.fromHex('#444041')
  const lightColor = Color.fromHex('#f6f0f1')
  const lightColorUnfocus = Color.fromHex('#eae5e6')
  const titlebar = new Titlebar({
    backgroundColor: isDark() ? darkColor : lightColor,
    icon: appIcon,
    unfocusEffect: false
  })

  function onBlur(dark: boolean | undefined = undefined) {
    const usedIsDark = dark ?? isDark()
    const usedColor = usedIsDark ? darkColorUnfocus : lightColorUnfocus
    titlebar.updateBackground(usedColor)
  }

  function onFocus(dark: boolean | undefined = undefined) {
    const usedIsDark = dark ?? isDark()
    const usedColor = usedIsDark ? darkColor : lightColor
    titlebar.updateBackground(usedColor)
  }

  onDarkPreferenceChanges(matches => {
    if (document.hasFocus()) {
      onFocus(matches)
    } else {
      onBlur(matches)
    }
  })

  window.addEventListener('blur', () => {
    onBlur()
  })

  window.addEventListener('focus', () => {
    onFocus()
  })

  try {
    const history = createHistory(createMemorySource('/'))

    render(
      <Theme>
        <LocationProvider history={history}>
          <AppProvider titlebar={titlebar}>
            <CompilationProvider>
              <SettingsProvider>
                <FocusProvider>
                  <TelemetryProvider>
                    <App />
                  </TelemetryProvider>
                </FocusProvider>
              </SettingsProvider>
            </CompilationProvider>
          </AppProvider>
        </LocationProvider>
      </Theme>,
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
