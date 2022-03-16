/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import useLocalStorage from 'react-use-localstorage'
import { Observable, Subject } from 'rxjs'

import { Script } from '../../common/types/script'
import { LocalStorage } from '../enums/local-storage.enum'
import { useBridge } from './use-bridge'

type RecentFilesContext = {
  recentFiles: Script[]
  onRecentFilesChanges: Observable<Script[]>
  setRecentFiles(scripts: Script[]): Promise<void>
  clearRecentFiles(): Promise<void>
  removeRecentFile(script: Script): Promise<Script[]>
  showFullPath: [boolean, Dispatch<SetStateAction<boolean>>]
}

const Context = createContext({} as RecentFilesContext)
const recentFiles$ = new Subject<Script[]>()
const onRecentFilesChanges = recentFiles$.asObservable()

const RecentFilesProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [recentFiles, setRecentFilesMemory] = useState<Script[]>([])
  const [isShowFullPath, setShowFullPath] = useLocalStorage(
    LocalStorage.recentFilesShowFullPath,
    'false',
  )
  const bridge = useBridge()

  useEffect(() => {
    const sub = onRecentFilesChanges.subscribe(scripts => {
      setRecentFilesMemory(scripts)
    })

    bridge.recentFiles.get().then(scripts => recentFiles$.next(scripts))

    return () => sub.unsubscribe()
  }, [bridge.recentFiles])

  const setRecentFiles = useCallback(
    async (scripts: Script[]) => {
      const newScripts = await bridge.recentFiles.set(scripts)

      recentFiles$.next(newScripts)
    },
    [bridge.recentFiles],
  )

  const clearRecentFiles = useCallback(async () => {
    console.log()

    await bridge.recentFiles.clear()

    recentFiles$.next([])
  }, [bridge.recentFiles])

  const removeRecentFile = useCallback(
    async (script: Script) => {
      const scripts = await bridge.recentFiles.remove(script)

      recentFiles$.next(scripts)

      return scripts
    },
    [bridge.recentFiles],
  )

  return (
    <Context.Provider
      value={{
        setRecentFiles,
        clearRecentFiles,
        removeRecentFile,
        onRecentFilesChanges,
        recentFiles,
        showFullPath: [
          isShowFullPath === 'true',
          (v => {
            if (is.function_(v)) {
              setShowFullPath(v(isShowFullPath === 'true') ? 'true' : 'false')
            } else {
              setShowFullPath(v ? 'true' : 'false')
            }
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
