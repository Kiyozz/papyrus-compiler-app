/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useDidMount } from 'rooks'
import { Observable, Subject } from 'rxjs'
// eslint-disable-next-line import/no-unresolved
import { PartialDeep } from 'type-fest'

import { Config } from '../../common/types/config'
import bridge from '../bridge'
import { ScriptStatus } from '../enums/script-status.enum'
import { Group } from '../types'
import { useIpc } from './use-ipc'

type AppContext = {
  setShowChangelog: (show: boolean) => void
  setChangelog: (changelog: string) => void
  setConfig: (config: PartialDeep<Config>, override?: boolean) => void
  setCheckUsingLastVersion: (check: boolean) => void
  isShowChangelog: boolean
  isCheckUsingLastVersion: boolean
  changelog: string
  config: Config
  groups: Group[]
  refreshConfig: () => void
  copyToClipboard: (text: string) => void
  onRefreshConfig: Observable<Config>
}

const Context = React.createContext({} as AppContext)

const _refresh$ = new Subject<Config>()
const _onRefreshConfig = _refresh$.asObservable()

const AppProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [config, setConfig] = useState<Config>({} as Config)
  const [groups, setGroups] = useState<Group[]>([])
  const [isShowChangelog, setShowChangelog] = useState(false)
  const [changelog, setChangelog] = useState('')
  const [isCheckUsingLastVersion, setCheckUsingLastVersion] = useState(false)

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

  const value: AppContext = useMemo(
    () => ({
      setShowChangelog,
      setChangelog,
      setConfig: updateConfig,
      setCheckUsingLastVersion,
      isShowChangelog,
      isCheckUsingLastVersion,
      changelog,
      config,
      groups,
      refreshConfig,
      copyToClipboard,
      onRefreshConfig: _onRefreshConfig,
    }),
    [
      changelog,
      config,
      copyToClipboard,
      groups,
      isCheckUsingLastVersion,
      isShowChangelog,
      refreshConfig,
      updateConfig,
    ],
  )

  if (is.undefined(config)) {
    return null
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useApp = (): AppContext => useContext(Context)

export default AppProvider
