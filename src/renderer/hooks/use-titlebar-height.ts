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

  return isMacOsBigSur ? 34 : isMacOs ? 22 : 32
}
