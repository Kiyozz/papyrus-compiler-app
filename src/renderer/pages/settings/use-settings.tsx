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
  configError: BadError
  checkConfig: () => void
  resetConfigError: () => void
}

const _Context = createContext({} as _SettingsContext)

const SettingsProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [configError, setConfigError] = useState<BadError>(false)

  const checkConfig = useCallback(async () => {
    const configError = await bridge.config.check()

    setConfigError(configError)
  }, [])

  const resetConfigError = useCallback(() => setConfigError(false), [])

  const value: _SettingsContext = useMemo(
    () => ({
      configError,
      checkConfig,
      resetConfigError,
    }),
    [checkConfig, configError, resetConfigError],
  )

  return <_Context.Provider value={value}>{children}</_Context.Provider>
}

export const useSettings = (): _SettingsContext => {
  return useContext(_Context)
}

export default SettingsProvider
