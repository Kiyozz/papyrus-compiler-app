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
import { ipcRenderer } from '../../../common/ipc'
import { BadErrorType } from '../../../common/interfaces/bad-error.type'
import { Events } from '../../../common/events'

interface StateProps {
  isBadInstallation: BadErrorType
  checkInstallation: () => void
  resetBadInstallation: () => void
}

type SettingsContextInterface = StateProps

const SettingsContext = createContext({} as SettingsContextInterface)

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({
  children
}: React.PropsWithChildren<unknown>) {
  const [isBadInstallation, setBadInstallation] = useState<BadErrorType>(false)

  const detectBadInstallation = useCallback(async () => {
    const fileExists = await ipcRenderer.invoke<BadErrorType>(
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
