/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Observable, Subject } from 'rxjs'
// eslint-disable-next-line import/no-unresolved
import { PartialDeep } from 'type-fest'

import { Config } from '../../common/types/config'
import bridge from '../bridge'
import { ScriptStatus } from '../enums/script-status.enum'
import { Group } from '../types'
import { useIpc } from './use-ipc'

type _AppContext = {
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

const _Context = React.createContext({} as _AppContext)

const _selectGroups = (config: Config): Group[] => {
  if (config.groups.length === 0) {
    return []
  }

  return config.groups.map(
    g =>
      new Group(
        g.name,
        g.scripts.map((s, i) => {
          return {
            status: ScriptStatus.idle,
            id: i,
            name: s.name,
            path: s.path,
          }
        }),
      ),
  )
}

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

  const updateConfig = (
    partialConfig: PartialDeep<Config>,
    override?: boolean,
  ) => {
    bridge.config.update(partialConfig, override).then(updatedConfig => {
      setConfig(updatedConfig)
      setGroups(_selectGroups(updatedConfig))
    })
  }

  const copyToClipboard = async (text: string) => {
    await bridge.clipboard.copy(text)
  }

  const refreshConfig = useCallback(() => {
    return bridge.config.get().then(refreshedConfig => {
      setConfig(refreshedConfig)
      setGroups(_selectGroups(refreshedConfig))
      _refresh$.next(refreshedConfig)
    })
  }, [])

  useEffect(() => {
    bridge.config.get().then(initialConfig => {
      setConfig(initialConfig)
      setGroups(_selectGroups(initialConfig))
    })
  }, [])

  const value: _AppContext = useMemo(
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
      groups,
      isCheckUsingLastVersion,
      isShowChangelog,
      refreshConfig,
    ],
  )

  if (is.undefined(config)) {
    return null
  }

  return <_Context.Provider value={value}>{children}</_Context.Provider>
}

export const useApp = (): _AppContext => useContext(_Context)

export default AppProvider
