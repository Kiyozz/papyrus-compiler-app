/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { useEffect, useState } from 'react'

import { isDark, onDarkPreferenceChanges } from '../utils/dark'

export function useSystemDarkPreference(): boolean {
  const [isUsingDark, setDark] = useState(isDark)

  useEffect(() => {
    const unsubscribe = onDarkPreferenceChanges(matches => setDark(matches))

    return () => unsubscribe()
  }, [])

  return isUsingDark
}
