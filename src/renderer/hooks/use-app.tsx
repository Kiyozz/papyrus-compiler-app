/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, {
  useCallback,
  useContext,
  useState,
} from 'react'
import { useDidMount } from 'rooks'
import { Subject } from 'rxjs'
import bridge from '../bridge'
import { ScriptStatus } from '../enums/script-status.enum'
import { Group } from '../types'
import { useIpc } from './use-ipc'
import type { PartialDeep } from 'type-fest'
import type { Config } from '../../common/types/config'
import type { Observable} from 'rxjs';
import type {
  Dispatch,
  SetStateAction} from 'react';

interface AppContext {
  showChangelogs: readonly [boolean, Dispatch<SetStateAction<boolean>>]
  showLatestVersionAlert: readonly [boolean, Dispatch<SetStateAction<boolean>>]
  changelogs: readonly [
    string | undefined,
    Dispatch<SetStateAction<string | undefined>>,
  ]
  setConfig: (config: PartialDeep<Config>, override?: boolean) => void
  config: Config
  groups: Group[]
  refreshConfig: () => void
  copyToClipboard: (text: string) => void
  onRefreshConfig: Observable<Config>
}

const Context = React.createContext({} as AppContext)

const _refresh$ = new Subject<Config>()
const _onRefreshConfig = _refresh$.asObservable()

function AppProvider({ children }: React.PropsWithChildren<unknown>) {
  const [config, setConfig] = useState<Config>({} as Config)
  const [groups, setGroups] = useState<Group[]>([])
  const [isShowChangelogs, setShowChangelogs] = useState(false)
  const [isShowLatestVersionAlert, setShowLatestVersionAlert] = useState(false)
  const [changelogs, setChangelogs] = useState<string | undefined>()

  useIpc(bridge.config.onReset, () => {
    window.location.reload()
  })

  const selectGroupsFromConfig = useCallback(
    (config: Config): Group[] => {
      if (config.groups.length === 0) return []

      return config.groups.map(
        g =>
          new Group(
            g.name,
            g.scripts.map(s => {
              return {
                status: ScriptStatus.idle,
                id: bridge.uuid(),
                name: s.name,
                path: s.path,
              }
            }),
          ),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bridge.uuid],
  )

  useDidMount(async () => {
    const initialConfig = await bridge.config.get()

    setConfig(initialConfig)
    setGroups(selectGroupsFromConfig(initialConfig))
  })

  const updateConfig = useCallback(
    async (partialConfig: PartialDeep<Config>, override?: boolean) => {
      const updatedConfig = await bridge.config.update(partialConfig, override)

      setConfig(updatedConfig)
      setGroups(selectGroupsFromConfig(updatedConfig))
    },
    [selectGroupsFromConfig],
  )

  const copyToClipboard = useCallback(async (text: string) => {
    await bridge.clipboard.copy(text)
  }, [])

  const refreshConfig = useCallback(async () => {
    const refreshedConfig = await bridge.config.get()

    setConfig(refreshedConfig)
    setGroups(selectGroupsFromConfig(refreshedConfig))
    _refresh$.next(refreshedConfig)
  }, [selectGroupsFromConfig])

  if (is.undefined(config)) {
    return null
  }

  return (
    <Context.Provider
      value={{
        showChangelogs: [isShowChangelogs, setShowChangelogs] as const,
        changelogs: [changelogs, setChangelogs] as const,
        showLatestVersionAlert: [
          isShowLatestVersionAlert,
          setShowLatestVersionAlert,
        ] as const,
        setConfig: updateConfig,
        config,
        groups,
        refreshConfig,
        copyToClipboard,
        onRefreshConfig: _onRefreshConfig,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useApp = (): AppContext => useContext(Context)

export default AppProvider
