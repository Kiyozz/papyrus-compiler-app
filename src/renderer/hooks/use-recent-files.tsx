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
import bridge from '../bridge'
import { LocalStorage } from '../enums/local-storage.enum'

type RecentFilesContext = {
  recentFiles: Script[]
  onRecentFilesChanges: Observable<Script[]>
  setRecentFiles(scripts: Script[]): Promise<void>
  clearRecentFiles(): Promise<void>
  removeRecentFile(script: Script): Promise<Script[]>
  showPath: [boolean, Dispatch<SetStateAction<boolean>>]
}

const Context = createContext({} as RecentFilesContext)
const recentFiles$ = new Subject<Script[]>()
const onRecentFilesChanges = recentFiles$.asObservable()

const RecentFilesProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [recentFiles, setRecentFilesMemory] = useState<Script[]>([])
  const [isShowPath, setShowPath] = useLocalStorage(
    LocalStorage.recentFilesShowFullPath,
    'false',
  )

  useEffect(() => {
    const sub = onRecentFilesChanges.subscribe(scripts => {
      setRecentFilesMemory(scripts)
    })

    bridge.recentFiles.get().then(scripts => recentFiles$.next(scripts))

    return () => sub.unsubscribe()
  }, [])

  const setRecentFiles = useCallback(async (scripts: Script[]) => {
    const newScripts = await bridge.recentFiles.set(scripts)

    recentFiles$.next(newScripts)
  }, [])

  const clearRecentFiles = useCallback(async () => {
    console.log()

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
        showPath: [
          isShowPath === 'true',
          (v => {
            if (is.function_(v)) {
              setShowPath(v(isShowPath === 'true') ? 'true' : 'false')
            } else {
              setShowPath(v ? 'true' : 'false')
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
