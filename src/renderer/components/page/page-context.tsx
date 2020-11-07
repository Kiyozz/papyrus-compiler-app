import { Config } from '@common/interfaces/Config'
import { PartialDeep } from '@common/interfaces/PartialDeep'
import * as EVENTS from '@common/events'
import is from '@sindresorhus/is'
import { ipcRenderer } from '@common/ipc'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ScriptStatus } from '../../enums/script-status.enum'
import { Group } from '../../models'
import { useStoreSelector } from '../../redux/use-store-selector'
import DropFilesOverlay from '../drop-files-overlay/drop-files-overlay'
import DropScripts, { OnDropFunction } from '../drop-scripts/drop-scripts'

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

const PageContextProvider: React.FC = ({ children }) => {
  const [config, setConfig] = useState<Config>({} as Config)
  const [groups, setGroups] = useState<Group[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [onDrop, setOnDrop] = useState<OnDropFunction | null>(null)
  const [AddScriptsButton, setAddScriptsButton] = useState<JSX.Element | null>(
    null
  )
  const version = useStoreSelector(state => state.changelog.version)

  const updateConfig = useCallback(
    (partialConfig: PartialDeep<Config>, override?: boolean) => {
      ipcRenderer
        .invoke(EVENTS.CONFIG_UPDATE, { config: partialConfig, override })
        .then((updatedConfig: Config) => {
          setConfig(updatedConfig)
          setGroups(selectGroups(updatedConfig))
        })
    },
    []
  )

  useEffect(() => {
    ipcRenderer.invoke(EVENTS.CONFIG_GET).then((initialConfig: Config) => {
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
            setDrawerOpen,
            addScriptsButton: Button,
            isDragActive,
            setOnDrop,
            setAddScriptsButton
          }}
        >
          <DropFilesOverlay open={isDragActive && onDrop !== null} />

          {children}
        </PageContext.Provider>
      )}
    </DropScripts>
  )
}

export default PageContextProvider
