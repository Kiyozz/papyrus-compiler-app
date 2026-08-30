/*
 * 2022-2026 Kiyozz.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { bridge } from '../../bridge'
import { hasError } from '#common/types/diagnostic.ts'
import type { Diagnostic, ExtractResult } from '#common/types/diagnostic.ts'

const empty: Diagnostic = { items: [] }

interface SettingsContext {
  diagnostic: Diagnostic
  /** true while at least one item stops the compilation from working */
  hasBlockingError: boolean
  diagnose: () => Promise<Diagnostic>
  resetDiagnostic: () => void
  /** extracts the archives then refreshes the diagnostic */
  extract: (archives: string[]) => Promise<ExtractResult[]>
}

const Context = createContext({} as SettingsContext)

function SettingsProvider({ children }: React.PropsWithChildren) {
  const [diagnostic, setDiagnostic] = useState<Diagnostic>(empty)

  const diagnose: SettingsContext['diagnose'] = useCallback(async () => {
    const result = await bridge.config.diagnose()

    setDiagnostic(result)

    return result
  }, [])

  const resetDiagnostic = useCallback(() => setDiagnostic(empty), [])

  const extract: SettingsContext['extract'] = useCallback(
    async (archives) => {
      const results = await bridge.ck.extract(archives)

      await diagnose()

      return results
    },
    [diagnose],
  )

  const value: SettingsContext = useMemo(
    () => ({
      diagnostic,
      hasBlockingError: hasError(diagnostic),
      diagnose,
      resetDiagnostic,
      extract,
    }),
    [diagnostic, diagnose, resetDiagnostic, extract],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useSettings = (): SettingsContext => {
  return useContext(Context)
}

export default SettingsProvider
