/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { createContext, useCallback, useContext } from 'react'

import {
  TelemetryEvents,
  TelemetryEventsProperties,
} from '../../common/telemetry-events'
import bridge from '../bridge'
import { Env } from '../env'
import { useApp } from './use-app'

type _TelemetryContext = {
  send: <E extends TelemetryEvents>(
    event: E,
    properties: TelemetryEventsProperties[E],
  ) => void
  setActive: (active: boolean) => void
}

const _Context = createContext({} as _TelemetryContext)

const TelemetryProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { config } = useApp()
  const sendTelemetry = useCallback(
    (
      event: TelemetryEvents,
      properties: TelemetryEventsProperties[TelemetryEvents],
    ) => {
      if (config.telemetry?.active && Env.telemetryFeature) {
        bridge.telemetry.send(event, properties)
      }
    },
    [config.telemetry],
  )
  const setActive = useCallback((active: boolean) => {
    bridge.telemetry.active(active)
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
