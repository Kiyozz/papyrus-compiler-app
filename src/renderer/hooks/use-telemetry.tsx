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
import { Env } from '../env'
import { useApp } from './use-app'
import { useBridge } from './use-bridge'

type TelemetryContext = {
  send: <E extends TelemetryEvent>(
    event: E,
    properties: TelemetryEventProperties[E],
  ) => void
  setActive: (active: boolean) => void
}

const Context = createContext({} as TelemetryContext)

const TelemetryProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { config } = useApp()
  const { telemetry } = useBridge()
  const sendTelemetry = useCallback(
    (
      event: TelemetryEvent,
      properties: TelemetryEventProperties[TelemetryEvent],
    ) => {
      if (config.telemetry?.active && Env.telemetryFeature) {
        telemetry.send(event, properties)
      }
    },
    [config.telemetry?.active, telemetry],
  )
  const setActive = useCallback(
    (active: boolean) => {
      telemetry.setActive(active)
    },
    [telemetry],
  )

  return (
    <Context.Provider value={{ send: sendTelemetry, setActive }}>
      {children}
    </Context.Provider>
  )
}

export const useTelemetry = (): TelemetryContext => {
  return useContext(Context)
}

export default TelemetryProvider
