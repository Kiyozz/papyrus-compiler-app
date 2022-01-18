/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

type Unsubscribe = () => void

export const isDark = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const onDarkPreferenceChanges = (
  onChange: (isDark: boolean) => void,
): Unsubscribe => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const onChangeInternal = (e: MediaQueryListEvent) => {
    onChange(e.matches)
  }

  media.addEventListener('change', onChangeInternal)

  return () => {
    media.removeEventListener('change', onChangeInternal)
  }
}
