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

import { CompilationResult } from '../../common/types/compilation-result'
import bridge from '../bridge'
import { ScriptStatus } from '../enums/script-status.enum'
import { ScriptRenderer } from '../types'
import { chunk } from '../utils/chunk'
import { useApp } from './use-app'

type StartOptions = {
  scripts: ScriptRenderer[]
}

type _CompilationContext = {
  start: (options: StartOptions) => void
  isRunning: boolean
  scripts: ScriptRenderer[]
  concurrentScripts: number
  logs: [ScriptRenderer, string][]
  setScripts: (fn: (scripts: ScriptRenderer[]) => ScriptRenderer[]) => void
}

const _Context = createContext({} as _CompilationContext)

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

const CompilationProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [isRunning, setRunning] = useState(false)
  const [compilationScripts, setCompilationScripts] = useState<
    ScriptRenderer[]
  >([])
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

  const start = useCallback(
    async ({ scripts }: StartOptions) => {
      setRunning(true)
      console.log('Starting compilation for', scripts)
      setCompilationLogs([])

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
          bridge.compilation.start(script.name)
        }

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

                cs[found].status = result.success
                  ? ScriptStatus.success
                  : ScriptStatus.failed

                return cs
              })

              setCompilationLogs(cl => {
                return [...cl, [s, result.output]]
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

                return cs
              })

              setCompilationLogs(cl => {
                return [...cl, [s, errorMessage]]
              })
            }
          }),
        )
      }

      setRunning(false)
    },
    [concurrentScripts],
  )

  return (
    <_Context.Provider
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
    </_Context.Provider>
  )
}

export const useCompilation = (): _CompilationContext => {
  return useContext(_Context)
}

export default CompilationProvider
