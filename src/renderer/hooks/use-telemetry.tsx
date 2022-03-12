/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { createContext, useCallback, useContext } from 'react'

import {
  TelemetryEvent,
  TelemetryEventProperties,
} from '../../common/telemetry-event'
import bridge from '../bridge'
import { Env } from '../env'
import { useApp } from './use-app'

type _TelemetryContext = {
  send: <E extends TelemetryEvent>(
    event: E,
    properties: TelemetryEventProperties[E],
  ) => void
  setActive: (active: boolean) => void
}

const _Context = createContext({} as _TelemetryContext)

const TelemetryProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { config } = useApp()
  const sendTelemetry = useCallback(
    (
      event: TelemetryEvent,
      properties: TelemetryEventProperties[TelemetryEvent],
    ) => {
      if (config.telemetry?.active && Env.telemetryFeature) {
        bridge.telemetry.send(event, properties)
      }
    },
    [config.telemetry],
  )
  const setActive = useCallback((active: boolean) => {
    bridge.telemetry.setActive(active)
  }, [])

  return (
    <_Context.Provider value={{ send: sendTelemetry, setActive }}>
      {children}
    </_Context.Provider>
  )
}

export const useTelemetry = (): _TelemetryContext => {
  return useContext(_Context)
}

export default TelemetryProvider
