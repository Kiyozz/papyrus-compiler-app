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
import { bridge } from '../../bridge'
import type { BadError } from '../../../common/types/bad-error'

interface SettingsContext {
  configError: BadError
  checkConfig: (checkMo2?: boolean) => Promise<void>
  resetConfigError: () => void
}

const Context = createContext({} as SettingsContext)

function SettingsProvider({ children }: React.PropsWithChildren) {
  const [configError, setConfigError] = useState<BadError>(false)

  const checkConfig: SettingsContext['checkConfig'] = useCallback(
    async (checkMo2 = false) => {
      const err = await bridge.config.check(checkMo2)

      setConfigError(err)
    },
    [],
  )

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
