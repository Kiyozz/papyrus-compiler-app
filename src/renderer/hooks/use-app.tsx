/*
 * Copyright (c) 2021 Kiyozz.
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
import { Titlebar } from 'custom-electron-titlebar'
import useLocalStorage from 'react-use-localstorage'
import { Config } from '../../common/interfaces/config.interface'
import { Events } from '../../common/events'
import { ipcRenderer } from '../../common/ipc'
import { ScriptStatus } from '../enums/script-status.enum'
import { Group } from '../interfaces'
import { LocalStorage } from '../enums/local-storage.enum'
import { DropFilesOverlay } from '../components/drop/drop-files-overlay'
import { DropScripts, OnDropFunction } from '../components/drop/drop-scripts'

interface AppContextInterface {
  setVersion: (version: string) => void
  setLatestVersion: (version: string) => void
  setShowChangelog: (show: boolean) => void
  setChangelog: (changelog: string) => void
  setDrawerOpen: (open: boolean) => void
  setAddScriptsButton: (button: JSX.Element | null) => void
  setConfig: (config: PartialDeep<Config>, override?: boolean) => void
  setDrawerExpand: (expand: boolean) => void
  setOnDrop: (on: (() => OnDropFunction) | null) => void
  version: string
  latestVersion: string
  isShowChangelog: boolean
  changelog: string
  drawerOpen: boolean
  addScriptsButton?: JSX.Element
  config: Config
  isDrawerExpand: boolean
  isDragActive: boolean
  groups: Group[]
  refreshConfig: () => void
  copyToClipboard: (text: string) => void
  onRefreshConfig: Observable<Config>
}

interface Props {
  titlebar: Titlebar
}

const AppContext = React.createContext({} as AppContextInterface)

export const useApp = () => useContext(AppContext)

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
            status: ScriptStatus.Idle,
            id: i,
            name: s.name,
            path: s.path
          }
        })
      )
  )
}

export function AppProvider({
  children,
  titlebar
}: React.PropsWithChildren<Props>) {
  const [config, setConfig] = useState<Config>({} as Config)
  const [groups, setGroups] = useState<Group[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [onDrop, setOnDrop] = useState<OnDropFunction | null>(null)
  const [AddScriptsButton, setAddScriptsButton] = useState<JSX.Element | null>(
    null
  )
  const refresh$ = useMemo(() => new Subject<Config>(), [])
  const [version, setVersion] = useState('')
  const [latestVersion, setLatestVersion] = useState('')
  const [isShowChangelog, setShowChangelog] = useState(false)
  const [changelog, setChangelog] = useState('')
  const [isDrawerExpandLS, setDrawerExpandLS] = useLocalStorage(
    LocalStorage.DrawerExpand,
    'false'
  )

  const isDrawerExpand = useMemo(() => isDrawerExpandLS === 'true', [
    isDrawerExpandLS
  ])
  const setDrawerExpand = useCallback(
    (drawerExpand: boolean) => setDrawerExpandLS(`${drawerExpand}`),
    [setDrawerExpandLS]
  )

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
    titlebar.updateTitle(`PCA ${version}`)
  }, [titlebar, version])

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
        <AppContext.Provider
          value={{
            setVersion,
            setLatestVersion,
            setShowChangelog,
            setChangelog,
            setDrawerOpen,
            setAddScriptsButton,
            setConfig: updateConfig,
            setDrawerExpand,
            setOnDrop,
            version,
            latestVersion,
            isShowChangelog,
            changelog,
            drawerOpen,
            addScriptsButton: Button,
            config,
            isDrawerExpand,
            isDragActive,
            groups,
            refreshConfig,
            copyToClipboard,
            onRefreshConfig
          }}
        >
          <DropFilesOverlay open={isDragActive && onDrop !== null} />

          {children}
        </AppContext.Provider>
      )}
    </DropScripts>
  )
}
