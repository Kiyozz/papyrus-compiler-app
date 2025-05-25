/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useEffect } from 'react'
import { usePlatform } from './use-platform'

export const useTitlebarHeight = () => {
  const platform = usePlatform()
  const isNotMacOs = platform !== 'macos' && platform !== 'macos-bigsur'
  const isMacOs = !isNotMacOs
  const isMacOsBigSur = platform === 'macos-bigsur'

  useEffect(() => {
    const height = isMacOsBigSur ? 34 : isMacOs ? 22 : 32

    document.documentElement.style.setProperty('--titlebar-height', `${height}px`)
  }, [isMacOs, isMacOsBigSur])

  if (isMacOsBigSur) return 34

  if (isMacOs) return 22

  return 32
}
