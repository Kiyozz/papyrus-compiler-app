/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { useEffect } from 'react'

import { Theme } from '../../common/theme'
import {
  darkColor,
  darkColorUnfocus,
  lightColor,
  lightColorUnfocus,
} from '../utils/color'
import { useFocus } from './use-focus'
import { useSystemDarkPreference } from './use-system-dark-preference'
import { useTheme } from './use-theme'
import { useTitlebar } from './use-titlebar'

import type { Color } from 'custom-electron-titlebar'

export function useSyncHtmlTheme(): void {
  const isSystemThemeDark = useSystemDarkPreference()
  const [theme] = useTheme()
  const isFocus = useFocus()
  const { titlebar } = useTitlebar()

  useEffect(() => {
    let usedColor: Color
    const colors = {
      light: lightColor,
      dark: darkColor,
    }

    if (!isFocus) {
      colors.light = lightColorUnfocus
      colors.dark = darkColorUnfocus
    }

    if (theme === Theme.dark) {
      usedColor = colors.dark
    } else if (theme === Theme.light) {
      usedColor = colors.light
    } else {
      usedColor = isSystemThemeDark ? colors.dark : colors.light
    }

    titlebar.updateBackground(usedColor)
  }, [isFocus, titlebar, isSystemThemeDark, theme])

  useEffect(() => {
    const list = document.documentElement.classList

    if (theme === Theme.dark) {
      list.add('dark')
    } else if (theme === Theme.light) {
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
