/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { BadError } from '../../../common/types/bad-error'
import bridge from '../../bridge'

type _SettingsContext = {
  isBadInstallation: BadError
  checkInstallation: () => void
  resetBadInstallation: () => void
}

const _Context = createContext({} as _SettingsContext)

const SettingsProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isBadInstallation, setBadInstallation] = useState<BadError>(false)

  const detectBadInstallation = useCallback(async () => {
    const fileExists = await bridge.installation.check()

    setBadInstallation(fileExists)
  }, [])

  const resetBadInstallation = useCallback(() => setBadInstallation(false), [])

  const value: _SettingsContext = useMemo(
    () => ({
      isBadInstallation,
      checkInstallation: detectBadInstallation,
      resetBadInstallation,
    }),
    [detectBadInstallation, isBadInstallation, resetBadInstallation],
  )

  return <_Context.Provider value={value}>{children}</_Context.Provider>
}

export const useSettings = (): _SettingsContext => {
  return useContext(_Context)
}

export default SettingsProvider
