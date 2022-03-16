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

import { Bridge } from '../../common/types/bridge'
import { CompilationResult } from '../../common/types/compilation-result'
import { ScriptStatus } from '../enums/script-status.enum'
import { ScriptRenderer } from '../types'
import { chunk } from '../utils/chunk'
import { scriptInList } from '../utils/scripts/equals'
import { isRunningScript } from '../utils/scripts/status'
import { useApp } from './use-app'
import { useBridge } from './use-bridge'

type StartOptions = {
  scripts: ScriptRenderer[]
}

type CompilationContext = {
  start: (options: StartOptions) => void
  isRunning: boolean
  scripts: ScriptRenderer[]
  concurrentScripts: number
  logs: [ScriptRenderer, string][]
  setScripts: (fn: (scripts: ScriptRenderer[]) => ScriptRenderer[]) => void
}

const Context = createContext({} as CompilationContext)

const whenCompileScriptFinish = (
  script: string,
  compilation: Bridge['compilation'],
): Promise<CompilationResult> => {
  return new Promise<CompilationResult>((resolve, reject) => {
    compilation.onceFinish(script, result => {
      if (result.success) {
        resolve(result)
      } else {
        reject(new Error(result.output))
      }
    })
  })
}

const CompilationProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const { compilation } = useBridge()

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
      (config?.compilation?.concurrentScripts ?? 0) === 0
        ? 1
        : config?.compilation?.concurrentScripts ?? 1,
    [config],
  )

  useEffect(() => {
    setRunning(compilationScripts.some(isRunningScript))
  }, [compilationScripts])

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

        for (const script of partialScripts) {
          compilation.start(script.name)
        }

        await Promise.all(
          partialScripts.map(async (s: ScriptRenderer) => {
            try {
              const result: CompilationResult = await whenCompileScriptFinish(
                s.name,
                compilation,
              )

              setCompilationScripts((cs: ScriptRenderer[]) => {
                const found = cs.findIndex(incs => incs.id === s.id)

                if (found === -1) {
                  return cs
                }

                cs[found].status = result.success
                  ? ScriptStatus.success
                  : ScriptStatus.failed

                return [...cs]
              })

              setCompilationLogs(cl => {
                return [[s, result.output], ...cl]
              })
            } catch (e) {
              let errorMessage: string

              if (e instanceof Error) {
                errorMessage = e.message
              } else {
                errorMessage = `unknown error ${e}`
              }

              setCompilationScripts((cs: ScriptRenderer[]) => {
                const found = cs.findIndex(incs => incs.id === s.id)

                if (found === -1) {
                  return cs
                }

                cs[found].status = ScriptStatus.failed

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
    [compilation, concurrentScripts],
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
