/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Observable, Subject } from 'rxjs'
import { PartialDeep } from 'type-fest'
import { Config } from '../../common/interfaces/config.interface'
import * as Events from '../../common/events'
import { ipcRenderer } from '../../common/ipc'
import { ScriptStatus } from '../enums/script-status.enum'
import { Group } from '../interfaces'
import { useStoreSelector } from '../redux/use-store-selector'
import { DropFilesOverlay } from './drop-files-overlay'
import { DropScripts, OnDropFunction } from './drop-scripts'

interface PageContextInterface {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  setOnDrop: (on: (() => OnDropFunction) | null) => void
  addScriptsButton?: JSX.Element
  setAddScriptsButton: (button: JSX.Element | null) => void
  isDragActive: boolean
  config: Config
  groups: Group[]
  updateConfig: (config: PartialDeep<Config>, override?: boolean) => void
  refreshConfig: () => void
  copyToClipboard: (text: string) => void
  onRefreshConfig: Observable<Config>
}

const PageContext = React.createContext({} as PageContextInterface)

export const usePageContext = () => useContext(PageContext)

function selectGroups(config: Config): Group[] {
  if (config.groups.length === 0) {
    return []
  }

  return config.groups.map(
    g =>
      new Group(
        g.name,
        g.scripts.map((s, i) => {
          return {
            status: ScriptStatus.IDLE,
            id: i,
            name: s.name,
            path: s.path
          }
        })
      )
  )
}

export function PageContextProvider({
  children
}: React.PropsWithChildren<unknown>) {
  const [config, setConfig] = useState<Config>({} as Config)
  const [groups, setGroups] = useState<Group[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [onDrop, setOnDrop] = useState<OnDropFunction | null>(null)
  const [AddScriptsButton, setAddScriptsButton] = useState<JSX.Element | null>(
    null
  )
  const version = useStoreSelector(state => state.changelog.version)

  const refresh$ = useMemo(() => new Subject<Config>(), [])

  const onRefreshConfig = useMemo(() => refresh$.asObservable(), [refresh$])

  const updateConfig = useCallback(
    (partialConfig: PartialDeep<Config>, override?: boolean) => {
      ipcRenderer
        .invoke<Config>(Events.ConfigUpdate, {
          config: partialConfig,
          override
        })
        .then(updatedConfig => {
          setConfig(updatedConfig)
          setGroups(selectGroups(updatedConfig))
        })
    },
    []
  )

  const copyToClipboard = useCallback(async (text: string) => {
    await ipcRenderer.invoke(Events.ClipboardCopy, { text })
  }, [])

  const refreshConfig = useCallback(() => {
    ipcRenderer.invoke<Config>(Events.ConfigGet).then(refreshedConfig => {
      setConfig(refreshedConfig)
      setGroups(selectGroups(refreshedConfig))
      refresh$.next(refreshedConfig)
    })
  }, [refresh$])

  useEffect(() => {
    ipcRenderer.invoke<Config>(Events.ConfigGet).then(initialConfig => {
      setConfig(initialConfig)
      setGroups(selectGroups(initialConfig))
    })
  }, [])

  if (is.undefined(config) || is.undefined(version)) {
    return null
  }

  return (
    <DropScripts
      accept=".psc"
      onlyClickButton
      onDrop={onDrop}
      Button={AddScriptsButton}
    >
      {({ Button, isDragActive }) => (
        <PageContext.Provider
          value={{
            drawerOpen,
            groups,
            config,
            updateConfig,
            refreshConfig,
            setDrawerOpen,
            addScriptsButton: Button,
            isDragActive,
            setOnDrop,
            setAddScriptsButton,
            onRefreshConfig,
            copyToClipboard
          }}
        >
          <DropFilesOverlay open={isDragActive && onDrop !== null} />

          {children}
        </PageContext.Provider>
      )}
    </DropScripts>
  )
}
