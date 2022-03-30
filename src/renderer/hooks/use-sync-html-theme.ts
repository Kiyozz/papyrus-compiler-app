/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useEffect } from 'react'
import { useIsDarkTheme } from './use-is-dark-theme'

export const useSyncHtmlTheme = (): void => {
  const isDark = useIsDarkTheme()

  useEffect(() => {
    const list = document.documentElement.classList

    if (isDark) {
      list.add('dark')
    } else {
      list.remove('dark')
    }
  }, [isDark])
}
