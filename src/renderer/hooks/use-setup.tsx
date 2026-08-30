/*
 * 2026 Kiyozz.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useDidMount } from 'rooks'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import { bridge } from '../bridge'
import { useApp } from './use-app'
import { useTelemetry } from './use-telemetry'

interface SetupContext {
  isOpen: boolean
  /**
   * true when the wizard opened on its own: PCA is unusable until the game and
   * the Creation Kit are found, so there is nothing to go back to.
   */
  isBlocking: boolean
  open: () => void
  close: () => void
  /** remembers the wizard was walked to its end, then closes it */
  complete: () => void
}

const Context = createContext({} as SetupContext)

function SetupProvider({ children }: React.PropsWithChildren) {
  const { config, setConfig } = useApp()
  const { send } = useTelemetry()
  const [isOpen, setOpen] = useState(false)
  const [isBlocking, setBlocking] = useState(false)

  // quitting halfway through leaves a settings file behind, so the first
  // launch alone cannot tell whether the setup was ever finished
  useDidMount(async () => {
    if (config.setup.done) {
      return
    }

    send(TelemetryEvent.setupWizardOpened, {
      firstLaunch: await bridge.config.firstLaunch(),
    })
    setBlocking(true)
    setOpen(true)
  })

  const open = useCallback(() => {
    send(TelemetryEvent.setupWizardOpened, { firstLaunch: false })
    setBlocking(false)
    setOpen(true)
  }, [send])

  const close = useCallback(() => {
    setBlocking(false)
    setOpen(false)
  }, [])

  const complete = useCallback(() => {
    setConfig({ setup: { done: true } })
    setBlocking(false)
    setOpen(false)
  }, [setConfig])

  const value: SetupContext = useMemo(
    () => ({ isOpen, isBlocking, open, close, complete }),
    [isOpen, isBlocking, open, close, complete],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useSetup = (): SetupContext => {
  return useContext(Context)
}

export default SetupProvider
