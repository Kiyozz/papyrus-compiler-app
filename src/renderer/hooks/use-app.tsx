/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { Titlebar } from 'custom-electron-titlebar'
import React, { useContext, useEffect, useState } from 'react'
import { Observable, Subject } from 'rxjs'
import { PartialDeep } from 'type-fest'

import { Events } from '../../common/events'
import { Config } from '../../common/interfaces/config'
import { ipcRenderer } from '../../common/ipc'
import { ScriptStatus } from '../enums/script-status.enum'
import { Group } from '../interfaces'

interface Context {
  setShowChangelog: (show: boolean) => void
  setChangelog: (changelog: string) => void
  setConfig: (config: PartialDeep<Config>, override?: boolean) => void
  isShowChangelog: boolean
  changelog: string
  config: Config
  groups: Group[]
  refreshConfig: () => void
  copyToClipboard: (text: string) => void
  onRefreshConfig: Observable<Config>
}

interface Props {
  titlebar: Titlebar
}

const AppContext = React.createContext({} as Context)

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

const refresh$ = new Subject<Config>()
const onRefreshConfig = refresh$.asObservable()

export const useApp = (): Context => useContext(AppContext)

export function AppProvider({
  children
}: React.PropsWithChildren<Props>): JSX.Element | null {
  const [config, setConfig] = useState<Config>({} as Config)
  const [groups, setGroups] = useState<Group[]>([])
  const [isShowChangelog, setShowChangelog] = useState(false)
  const [changelog, setChangelog] = useState('')

  const updateConfig = (
    partialConfig: PartialDeep<Config>,
    override?: boolean
  ) => {
    ipcRenderer
      .invoke<Config>(Events.ConfigUpdate, {
        config: partialConfig,
        override
      })
      .then(updatedConfig => {
        setConfig(updatedConfig)
        setGroups(selectGroups(updatedConfig))
      })
  }

  const copyToClipboard = async (text: string) => {
    await ipcRenderer.invoke(Events.ClipboardCopy, { text })
  }

  const refreshConfig = () =>
    ipcRenderer.invoke<Config>(Events.ConfigGet).then(refreshedConfig => {
      setConfig(refreshedConfig)
      setGroups(selectGroups(refreshedConfig))
      refresh$.next(refreshedConfig)
    })

  useEffect(() => {
    ipcRenderer.invoke<Config>(Events.ConfigGet).then(initialConfig => {
      setConfig(initialConfig)
      setGroups(selectGroups(initialConfig))
    })
  }, [])

  if (is.undefined(config)) {
    return null
  }

  return (
    <AppContext.Provider
      value={{
        setShowChangelog,
        setChangelog,
        setConfig: updateConfig,
        isShowChangelog,
        changelog,
        config,
        groups,
        refreshConfig,
        copyToClipboard,
        onRefreshConfig
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
