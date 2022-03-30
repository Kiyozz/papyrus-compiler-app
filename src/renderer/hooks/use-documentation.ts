/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import {
  MOD_DOCUMENTATION_URL,
  MOD_DOCUMENTATION_URL_DEV,
} from '../../common/env'
import { TelemetryEvent } from '../../common/telemetry-event'
import { bridge } from '../bridge'
import { useProduction } from './use-production'
import { useTelemetry } from './use-telemetry'

export const useDocumentation = () => {
  const isProduction = useProduction()
  const { send } = useTelemetry()
  const url = isProduction ? MOD_DOCUMENTATION_URL : MOD_DOCUMENTATION_URL_DEV

  const openTheDocumentation = (
    reason: 'enter' | 'click' | 'settings-app-bar',
  ) => {
    send(TelemetryEvent.documentationOpenFromNav, { reason })
    void bridge.shell.openExternal(url)
  }

  return {
    open: openTheDocumentation,
    url,
  }
}
