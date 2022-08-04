/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import is from '@sindresorhus/is'
import { bridge } from '../bridge'
import { ScriptStatus } from '../enums/script-status.enum'
import { chunk } from '../utils/chunk'
import { scriptEquals, scriptInList } from '../utils/scripts/equals'
import { isRunningScript } from '../utils/scripts/status'
import { fromError } from '../../common/from-error'
import { useApp } from './use-app'
import type { ScriptRenderer } from '../types'
import type { CompilationResult } from '../../common/types/compilation-result'

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

const whenCompileScriptFinish = (
  script: string,
): Promise<CompilationResult> => {
  return new Promise<CompilationResult>((resolve, reject) => {
    bridge.compilation.onceFinish(script, result => {
      if (result.success) {
        resolve(result)
      } else {
        reject(new Error(result.output))
      }
    })
  })
}

function CompilationProvider({ children }: React.PropsWithChildren) {
  const [compilationScripts, setCompilationScripts] = useState<
    ScriptRenderer[]
  >([])
  const [isRunning, setRunning] = useState(false)
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

  useEffect(() => {
    setRunning(compilationScripts.some(isRunningScript))
  }, [compilationScripts])

  const clearCompilationLogs = useCallback((script?: ScriptRenderer) => {
    if (script) {
      setCompilationLogs(logs => {
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
      console.log('Starting compilation for', scripts)
      setCompilationLogs(logs => {
        return logs.filter(([s]) => {
          return !scriptInList(scripts)(s)
        })
      })

      const scriptsOfScripts = chunk(scripts, concurrentScripts)

      for (const partialScripts of scriptsOfScripts) {
        setCompilationScripts((cs: ScriptRenderer[]) => {
          return cs.map((s: ScriptRenderer) => {
            const found = partialScripts.find(ps => ps.id === s.id)

            if (!found) {
              return s
            }

            s.status = ScriptStatus.running

            return s
          })
        })

        partialScripts.forEach(script => {
          bridge.compilation.start(script.name)
        })

        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          partialScripts.map(async (s: ScriptRenderer) => {
            try {
              const result: CompilationResult = await whenCompileScriptFinish(
                s.name,
              )

              setCompilationScripts((cs: ScriptRenderer[]) => {
                const found = cs.findIndex(incs => incs.id === s.id)

                if (found === -1) {
                  return cs
                }

                const foundCs = cs[found]

                if (is.undefined(foundCs)) {
                  throw new TypeError('foundCs is undefined')
                }

                foundCs.status = result.success
                  ? ScriptStatus.success
                  : ScriptStatus.failed

                return [...cs]
              })

              setCompilationLogs(cl => {
                return [[s, result.output], ...cl]
              })
            } catch (e) {
              const errorMessage = fromError(e).message

              setCompilationScripts((cs: ScriptRenderer[]) => {
                const found = cs.findIndex(incs => incs.id === s.id)

                if (found === -1) {
                  return cs
                }

                const foundCs = cs[found]

                if (is.undefined(foundCs)) {
                  throw new TypeError('foundCs is undefined')
                }

                foundCs.status = ScriptStatus.failed

                return [...cs]
              })

              setCompilationLogs(cl => {
                return [[s, errorMessage], ...cl]
              })
            }
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
