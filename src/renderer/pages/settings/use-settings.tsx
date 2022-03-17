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

type SettingsContext = {
  configError: BadError
  checkConfig: () => void
  resetConfigError: () => void
}

const Context = createContext({} as SettingsContext)

const SettingsProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [configError, setConfigError] = useState<BadError>(false)

  const checkConfig = useCallback(async () => {
    const configError = await bridge.config.check()

    setConfigError(configError)
  }, [])

  const resetConfigError = useCallback(() => setConfigError(false), [])

  const value: SettingsContext = useMemo(
    () => ({
      configError,
      checkConfig,
      resetConfigError,
    }),
    [checkConfig, configError, resetConfigError],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useSettings = (): SettingsContext => {
  return useContext(Context)
}

export default SettingsProvider
