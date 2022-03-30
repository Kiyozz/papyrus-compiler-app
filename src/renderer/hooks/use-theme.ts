/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useCallback } from 'react'
import { TelemetryEvent } from '../../common/telemetry-event'
import { Theme } from '../../common/theme'
import { useApp } from './use-app'
import { useTelemetry } from './use-telemetry'

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const {
    setConfig,
    config: { theme },
  } = useApp()
  const { send } = useTelemetry()

  const setTheme = useCallback(
    (theme: Theme) => {
      if (![Theme.system, Theme.light, Theme.dark].includes(theme)) {
        return
      }

      send(TelemetryEvent.settingsTheme, { theme })
      setConfig({ theme })
    },
    [setConfig, send],
  )

  return [theme, setTheme]
}
