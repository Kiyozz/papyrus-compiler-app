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
import { bridge } from '../bridge'
import { Logger } from '../lib/logger'
import { ScriptStatus } from '../enums/script-status.enum'
import { chunk } from '../utils/chunk'
import { scriptEquals, scriptInList } from '../utils/scripts/equals'
import { isRunningScript } from '../utils/scripts/status'
import { useApp } from './use-app'
import type { ScriptRenderer } from '../types'

const logger = new Logger('Compilation')

interface StartOptions {
  scripts: ScriptRenderer[]
}

interface CompilationContext {
  start: (options: StartOptions) => void
  isRunning: boolean
  scripts: ScriptRenderer[]
  concurrentScripts: number
  logs: [ScriptRenderer, string][]
  setScripts: (fn: (scripts: ScriptRenderer[]) => ScriptRenderer[]) => void
  clearCompilationLogs: (script?: ScriptRenderer) => void
}

const Context = createContext({} as CompilationContext)

function CompilationProvider({ children }: React.PropsWithChildren) {
  const [compilationScripts, setCompilationScripts] = useState<
    ScriptRenderer[]
  >([])
  const [compilationLogs, setCompilationLogs] = useState<
    [ScriptRenderer, string][]
  >([])
  const { config } = useApp()
  const concurrentScripts = useMemo(
    () =>
      config.compilation.concurrentScripts === 0
        ? 1
        : config.compilation.concurrentScripts,
    [config],
  )

  const isRunning = useMemo(
    () => compilationScripts.some(isRunningScript),
    [compilationScripts],
  )

  const clearCompilationLogs = useCallback((script?: ScriptRenderer) => {
    if (script) {
      setCompilationLogs((logs) => {
        return logs.filter(([s]) => {
          return !scriptEquals(script)(s)
        })
      })
    } else {
      setCompilationLogs([])
    }
  }, [])

  const start = useCallback(
    async ({ scripts }: StartOptions) => {
      logger.debug('starting compilation for', scripts.length, 'scripts')
      setCompilationLogs((logs) => {
        return logs.filter(([s]) => {
          return !scriptInList(scripts)(s)
        })
      })

      const scriptsOfScripts = chunk(scripts, concurrentScripts)

      for (const partialScripts of scriptsOfScripts) {
        setCompilationScripts((cs: ScriptRenderer[]) =>
          cs.map((s: ScriptRenderer) =>
            partialScripts.some((ps) => ps.id === s.id)
              ? { ...s, status: ScriptStatus.running }
              : s,
          ),
        )

        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          partialScripts.map(async (s: ScriptRenderer) => {
            await bridge.compilation.start(s.path, (result) => {
              setCompilationScripts((cs: ScriptRenderer[]) =>
                cs.map((c) =>
                  c.id === s.id
                    ? {
                        ...c,
                        status: result.success
                          ? ScriptStatus.success
                          : ScriptStatus.failed,
                      }
                    : c,
                ),
              )

              setCompilationLogs((cl) => {
                return [[s, result.output], ...cl]
              })
            })
          }),
        )
      }
    },
    [concurrentScripts],
  )

  return (
    <Context.Provider
      value={{
        start,
        isRunning,
        scripts: compilationScripts,
        logs: compilationLogs,
        setScripts: setCompilationScripts,
        concurrentScripts,
        clearCompilationLogs,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCompilation = (): CompilationContext => {
  return useContext(Context)
}

export default CompilationProvider
