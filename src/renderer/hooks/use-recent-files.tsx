/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import useLocalStorage from 'react-use-localstorage'
import { Subject } from 'rxjs'
import { TelemetryEvent } from '../../common/telemetry-event'
import { bridge } from '../bridge'
import { LocalStorage } from '../enums/local-storage.enum'
import { useTelemetry } from './use-telemetry'
import type { Script } from '../../common/types/script'
import type { Observable } from 'rxjs'
import type { Dispatch, SetStateAction } from 'react'

interface RecentFilesContext {
  recentFiles: Script[]
  onRecentFilesChanges: Observable<Script[]>
  setRecentFiles: (scripts: Script[]) => Promise<void>
  clearRecentFiles: () => Promise<void>
  removeRecentFile: (script: Script) => Promise<Script[]>
  moreDetails: [boolean, Dispatch<SetStateAction<boolean>>]
}

const Context = createContext({} as RecentFilesContext)
const recentFiles$ = new Subject<Script[]>()
const onRecentFilesChanges = recentFiles$.asObservable()

function RecentFilesProvider({ children }: React.PropsWithChildren) {
  const { send } = useTelemetry()
  const [recentFiles, setRecentFilesMemory] = useState<Script[]>([])
  const [isMoreDetails, setMoreDetails] = useLocalStorage(
    LocalStorage.recentFilesMoreDetails,
    'false',
  )

  useEffect(() => {
    const sub = onRecentFilesChanges.subscribe(scripts => {
      setRecentFilesMemory(scripts)
    })

    void bridge.recentFiles.get().then(scripts => recentFiles$.next(scripts))

    return () => sub.unsubscribe()
  }, [])

  const setRecentFiles = useCallback(async (scripts: Script[]) => {
    const newScripts = await bridge.recentFiles.set(scripts)

    recentFiles$.next(newScripts)
  }, [])

  const clearRecentFiles = useCallback(async () => {
    await bridge.recentFiles.clear()

    recentFiles$.next([])
  }, [])

  const removeRecentFile = useCallback(async (script: Script) => {
    const scripts = await bridge.recentFiles.remove(script)

    recentFiles$.next(scripts)

    return scripts
  }, [])

  return (
    <Context.Provider
      value={{
        setRecentFiles,
        clearRecentFiles,
        removeRecentFile,
        onRecentFilesChanges,
        recentFiles,
        moreDetails: [
          isMoreDetails === 'true',
          (v => {
            const enable = is.function_(v) ? v(isMoreDetails === 'true') : v

            send(TelemetryEvent.recentFilesMoreDetails, { moreDetails: enable })

            setMoreDetails(enable ? 'true' : 'false')
          }) as Dispatch<SetStateAction<boolean>>,
        ],
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useRecentFiles = (): RecentFilesContext => useContext(Context)

export default RecentFilesProvider
