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
import { Observable, Subject } from 'rxjs'

import { Script } from '../../common/types/script'
import bridge from '../bridge'

type _RecentFilesContext = {
  recentFiles: Script[]
  onRecentFilesChanges: Observable<Script[]>
  setRecentFiles(scripts: Script[]): Promise<void>
  clearRecentFiles(): Promise<void>
  removeRecentFile(script: Script): Promise<Script[]>
}

const _Context = createContext({} as _RecentFilesContext)
const _recentFiles$ = new Subject<Script[]>()
const _onRecentFilesChanges = _recentFiles$.asObservable()

const RecentFilesProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [recentFiles, setRecentFilesMemory] = useState<Script[]>([])

  useEffect(() => {
    const sub = _onRecentFilesChanges.subscribe(scripts => {
      setRecentFilesMemory(scripts)
    })

    bridge.recentFiles.get().then(scripts => _recentFiles$.next(scripts))

    return () => sub.unsubscribe()
  }, [])

  const setRecentFiles = useCallback(async (scripts: Script[]) => {
    const newScripts = await bridge.recentFiles.set(scripts)

    _recentFiles$.next(newScripts)
  }, [])

  const clearRecentFiles = useCallback(async () => {
    console.log()

    await bridge.recentFiles.clear()

    _recentFiles$.next([])
  }, [])

  const removeRecentFile = useCallback(async (script: Script) => {
    const scripts = await bridge.recentFiles.remove(script)

    _recentFiles$.next(scripts)

    return scripts
  }, [])

  const value: _RecentFilesContext = useMemo(
    () => ({
      setRecentFiles,
      clearRecentFiles,
      removeRecentFile,
      onRecentFilesChanges: _onRecentFilesChanges,
      recentFiles,
    }),
    [setRecentFiles, clearRecentFiles, removeRecentFile, recentFiles],
  )

  return <_Context.Provider value={value}>{children}</_Context.Provider>
}

export const useRecentFiles = (): _RecentFilesContext => useContext(_Context)

export default RecentFilesProvider
