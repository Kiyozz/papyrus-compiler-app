/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { useEffect, useState } from 'react'

import { isDark, onDarkPreferenceChanges } from '../utils/dark'

export function useDarkPreference(): boolean {
  const [isUsingDark, setDark] = useState(isDark)

  useEffect(() => {
    function onChange(matches: boolean) {
      setDark(matches)
    }

    const unsubscribe = onDarkPreferenceChanges(onChange)

    return () => unsubscribe()
  }, [])

  return isUsingDark
}
