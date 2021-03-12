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

import { Events } from '../../common/events'
import { CompilationResult } from '../../common/interfaces/compilation-result'
import { ipcRenderer } from '../../common/ipc'
import { ScriptStatus } from '../enums/script-status.enum'
import { ScriptInterface } from '../interfaces'
import { chunk } from '../utils/chunk'
import { useApp } from './use-app'

interface StartOptions {
  scripts: ScriptInterface[]
}

interface CompilationContextInterface {
  start: (options: StartOptions) => void
  isRunning: boolean
  scripts: ScriptInterface[]
  logs: [ScriptInterface, string][]
  setScripts: (fn: (scripts: ScriptInterface[]) => ScriptInterface[]) => void
}

const CompilationContext = createContext({} as CompilationContextInterface)

function whenCompileScriptFinish(script: string): Promise<CompilationResult> {
  return new Promise<CompilationResult>((resolve, reject) => {
    ipcRenderer.once<CompilationResult>(
      `${Events.CompileScriptFinish}-${script}`,
      result => {
        if (result.success) {
          resolve(result)
        } else {
          reject(new Error(result.output))
        }
      }
    )
  })
}

export function useCompilation(): CompilationContextInterface {
  return useContext(CompilationContext)
}

export function CompilationProvider({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [isRunning, setRunning] = useState(false)
  const [compilationScripts, setCompilationScripts] = useState<
    ScriptInterface[]
  >([])
  const [compilationLogs, setCompilationLogs] = useState<
    [ScriptInterface, string][]
  >([])
  const { config } = useApp()
  const concurrentScripts = useMemo(
    () =>
      (config?.compilation?.concurrentScripts ?? 0) === 0
        ? 1
        : config?.compilation?.concurrentScripts ?? 1,
    [config]
  )

  const start = useCallback(
    async ({ scripts }: StartOptions) => {
      setRunning(true)
      console.log('Starting compilation for', scripts)
      setCompilationLogs([])

      const scriptsOfScripts = chunk(scripts, concurrentScripts)

      for (const partialScripts of scriptsOfScripts) {
        setCompilationScripts((cs: ScriptInterface[]) => {
          return cs.map((s: ScriptInterface) => {
            const found = partialScripts.find(ps => ps.id === s.id)

            if (!found) {
              return s
            }

            s.status = ScriptStatus.Running

            return s
          })
        })

        for (const script of partialScripts) {
          ipcRenderer.send(Events.CompileScriptStart, script.name)
        }

        await Promise.all(
          partialScripts.map(async (s: ScriptInterface) => {
            try {
              const result: CompilationResult = await whenCompileScriptFinish(
                s.name
              )

              setCompilationScripts((cs: ScriptInterface[]) => {
                const found = cs.findIndex(incs => incs.id === s.id)

                if (found === -1) {
                  return cs
                }

                cs[found].status = result.success
                  ? ScriptStatus.Success
                  : ScriptStatus.Failed

                return cs
              })

              setCompilationLogs(cl => {
                return [...cl, [s, result.output]]
              })
            } catch (e) {
              setCompilationLogs(cl => {
                return [...cl, [s, e.message]]
              })
            }
          })
        )
      }

      setRunning(false)
    },
    [concurrentScripts]
  )

  return (
    <CompilationContext.Provider
      value={{
        start,
        isRunning,
        scripts: compilationScripts,
        logs: compilationLogs,
        setScripts: setCompilationScripts
      }}
    >
      {children}
    </CompilationContext.Provider>
  )
}
