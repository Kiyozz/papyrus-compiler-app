/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

import { Events } from '../../../common/events'
import { BadError } from '../../../common/interfaces/bad-error'
import { ipcRenderer } from '../../../common/ipc'

interface StateProps {
  isBadInstallation: BadError
  checkInstallation: () => void
  resetBadInstallation: () => void
}

type SettingsContextInterface = StateProps

const SettingsContext = createContext({} as SettingsContextInterface)

export const useSettings = (): SettingsContextInterface =>
  useContext(SettingsContext)

export function SettingsProvider({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [isBadInstallation, setBadInstallation] = useState<BadError>(false)

  const detectBadInstallation = useCallback(async () => {
    const fileExists = await ipcRenderer.invoke<BadError>(
      Events.CheckInstallation
    )

    setBadInstallation(fileExists)
  }, [])

  const resetBadInstallation = useCallback(() => setBadInstallation(false), [])

  const value: SettingsContextInterface = useMemo(
    () => ({
      isBadInstallation,
      checkInstallation: detectBadInstallation,
      resetBadInstallation
    }),
    [detectBadInstallation, isBadInstallation, resetBadInstallation]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
