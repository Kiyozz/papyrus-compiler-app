/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useEffect } from 'react'

import { Theme } from '../../common/theme'
import { useSystemDarkPreference } from './use-system-dark-preference'
import { useTheme } from './use-theme'

export const useSyncHtmlTheme = (): void => {
  const isSystemThemeDark = useSystemDarkPreference()
  const [theme] = useTheme()

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
