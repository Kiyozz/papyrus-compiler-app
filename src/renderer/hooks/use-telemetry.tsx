/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { createContext, useCallback, useContext, useMemo } from 'react'

import { Events } from '../../common/events'
import { ipcRenderer } from '../../common/ipc'
import {
  TelemetryEvents,
  TelemetryEventsProperties
} from '../../common/telemetry-events'
import { isProduction } from '../utils/is-production'
import { useApp } from './use-app'

interface TelemetryContextInterface {
  send: <E extends TelemetryEvents>(
    event: E,
    properties: TelemetryEventsProperties[E]
  ) => void
  setActive: (active: boolean) => void
}

const TelemetryContext = createContext({} as TelemetryContextInterface)

export const useTelemetry = (): TelemetryContextInterface =>
  useContext(TelemetryContext)

export function TelemetryProvider({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const production = useMemo(() => isProduction(), [])
  const { config } = useApp()
  const sendTelemetry = useCallback(
    (event: TelemetryEvents, properties: Record<string, unknown>) => {
      if (config.telemetry?.active) {
        production.then(p => {
          if (!p) {
            ipcRenderer
              .invoke(Events.Telemetry, { name: event, properties })
              .catch(e =>
                console.error(
                  "can't send telemetry event to main process",
                  e.message || e
                )
              )
          }
        })
      }
    },
    [config.telemetry, production]
  )
  const setActive = useCallback((active: boolean) => {
    ipcRenderer.invoke(Events.TelemetryActive, active)
  }, [])

  return (
    <TelemetryContext.Provider value={{ send: sendTelemetry, setActive }}>
      {children}
    </TelemetryContext.Provider>
  )
}
