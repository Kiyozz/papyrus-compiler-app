/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { usePlatform } from './use-platform'

export const useTitlebarHeight = () => {
  const platform = usePlatform()
  const isNotMacOs = platform !== 'macos' && platform !== 'macos-bigsur'
  const isMacOs = !isNotMacOs
  const isMacOsBigSur = platform === 'macos-bigsur'

  if (isMacOsBigSur) return 34

  if (isMacOs) return 22

  return 32
}
