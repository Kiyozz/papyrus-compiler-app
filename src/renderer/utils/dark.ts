/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

type Unsubscribe = () => void

export function isDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function onDarkPreferenceChanges(
  onChange: (isDark: boolean) => void
): Unsubscribe {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  function onChangeInternal(e: MediaQueryListEvent) {
    onChange(e.matches)
  }

  media.addEventListener('change', onChangeInternal)

  return () => {
    media.removeEventListener('change', onChangeInternal)
  }
}
