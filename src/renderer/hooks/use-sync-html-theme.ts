/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Color } from 'custom-electron-titlebar'
import { useEffect } from 'react'

import { Theme } from '../../common/theme'
import {
  darkColor,
  darkColorUnfocus,
  lightColor,
  lightColorUnfocus
} from '../utils/color'
import { useFocus } from './use-focus'
import { useSystemDarkPreference } from './use-system-dark-preference'
import { useTheme } from './use-theme'
import { useTitlebar } from './use-titlebar'

export function useSyncHtmlTheme(): void {
  const isSystemThemeDark = useSystemDarkPreference()
  const [theme] = useTheme()
  const { titlebar } = useTitlebar()
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

    titlebar.updateBackground(usedColor)
  }, [isFocus, isSystemThemeDark, theme, titlebar])

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
