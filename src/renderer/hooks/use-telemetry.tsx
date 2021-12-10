/*
 * Copyright (c) 2021 Kiyozz.
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

interface TelemetryContextInterface {
  send: <E extends TelemetryEvents>(
    event: E,
    properties: TelemetryEventsProperties[E],
  ) => void
  setActive: (active: boolean) => void
}

const TelemetryContext = createContext({} as TelemetryContextInterface)

export const useTelemetry = (): TelemetryContextInterface =>
  useContext(TelemetryContext)

export function TelemetryProvider({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element {
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
    <TelemetryContext.Provider value={{ send: sendTelemetry, setActive }}>
      {children}
    </TelemetryContext.Provider>
  )
}
