/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { createContext, useContext } from 'react'
import { bridge } from '../bridge'
import { Env } from '../env'
import { useApp } from './use-app'
import type {
  TelemetryEvent,
  TelemetryEventProperties,
} from '../../common/telemetry-event'

interface TelemetryContext {
  send: <E extends TelemetryEvent>(
    event: E,
    properties: TelemetryEventProperties[E],
  ) => void
  setActive: (active: boolean) => void
}

const Context = createContext({} as TelemetryContext)

function TelemetryProvider({ children }: React.PropsWithChildren) {
  const { config } = useApp()

  const sendTelemetry = (
    event: TelemetryEvent,
    properties: TelemetryEventProperties[TelemetryEvent],
  ) => {
    if (config.telemetry.active && Env.telemetryFeature) {
      void bridge.telemetry.send(event, properties)
    }
  }

  const setActive = (active: boolean) => {
    void bridge.telemetry.setActive(active)
  }

  return (
    <Context.Provider value={{ send: sendTelemetry, setActive }}>
      {children}
    </Context.Provider>
  )
}

export const useTelemetry = (): TelemetryContext => useContext(Context)

export default TelemetryProvider
