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
import { Titlebar, Color } from 'custom-electron-titlebar'
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
                  <App />
                </FocusProvider>
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
