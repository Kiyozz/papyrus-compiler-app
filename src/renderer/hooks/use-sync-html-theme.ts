/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import type { Color } from 'custom-electron-titlebar'
import { useEffect } from 'react'

import { Theme } from '../../common/theme'
import bridge from '../bridge'
import { useFocus } from './use-focus'
import { useSystemDarkPreference } from './use-system-dark-preference'
import { useTheme } from './use-theme'

export function useSyncHtmlTheme(): void {
  const {
    darkColor,
    darkColorUnfocus,
    lightColor,
    lightColorUnfocus
  } = bridge.titlebar.colors

  const isSystemThemeDark = useSystemDarkPreference()
  const [theme] = useTheme()
  const isFocus = useFocus()

  useEffect(() => {
    let usedColor: Color
    const colors = {
      light: lightColor,
      dark: darkColor
    }

    if (!isFocus) {
      colors.light = lightColorUnfocus
      colors.dark = darkColorUnfocus
    }

    if (theme === Theme.Dark) {
      usedColor = colors.dark
    } else if (theme === Theme.Light) {
      usedColor = colors.light
    } else {
      usedColor = isSystemThemeDark ? colors.dark : colors.light
    }

    bridge.titlebar.updateBackground(usedColor)
  }, [
    darkColor,
    darkColorUnfocus,
    isFocus,
    isSystemThemeDark,
    lightColor,
    lightColorUnfocus,
    theme
  ])

  useEffect(() => {
    const list = document.documentElement.classList

    if (theme === Theme.Dark) {
      list.add('dark')
    } else if (theme === Theme.Light) {
      list.remove('dark')
    } else {
      if (isSystemThemeDark) {
        list.add('dark')
      } else {
        list.remove('dark')
      }
    }
  }, [theme, isSystemThemeDark])
}
