import { Config, EVENTS, PartialDeep } from '@common'
import type { Stats } from '@common'
import is from '@sindresorhus/is'
import { ipcRenderer as ipc } from 'electron-better-ipc'
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

async function selectGroups(config: Config): Promise<Group[]> {
  if (config.groups.length === 0) {
    return []
  }

  const scripts = config.groups.reduce<string[]>((scr, group) => {
    return [...scr, ...group.scripts.map(s => s.path)]
  }, [])

  const stats = await ipc.callMain<string[], Map<string, Stats>>(EVENTS.FILES_STATS, scripts)

  return config.groups.map(
    g =>
      new Group(
        g.name,
        g.scripts.map((s, i) => {
          const lastModified = stats.get(s.path)?.mtimeMs

          return {
            status: ScriptStatus.IDLE,
            lastModified: lastModified ?? 0,
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
  const [AddScriptsButton, setAddScriptsButton] = useState<JSX.Element | null>(null)
  const version = useStoreSelector(state => state.changelog.version)

  const updateConfig = useCallback((partialConfig: PartialDeep<Config>, override?: boolean) => {
    ipc
      .callMain<{ config: PartialDeep<Config>; override?: boolean }, Config>(EVENTS.CONFIG_UPDATE, { config: partialConfig, override })
      .then(async updatedConfig => {
        setConfig(updatedConfig)
        setGroups(await selectGroups(updatedConfig))
      })
  }, [])

  useEffect(() => {
    ipc.callMain<unknown, Config>(EVENTS.CONFIG_GET).then(async initialConfig => {
      setConfig(initialConfig)
      setGroups(await selectGroups(initialConfig))
    })
  }, [])

  useEffect(() => {
    const cb = ipc.answerMain<Config>(EVENTS.CONFIG_UPDATED, configUpdated => {
      setConfig(configUpdated)
    })

    return () => cb()
  }, [])

  if (is.undefined(config) || is.undefined(version)) {
    return null
  }

  return (
    <DropScripts accept=".psc" onlyClickButton onDrop={onDrop} Button={AddScriptsButton}>
      {({ Button, isDragActive }) => (
        <PageContext.Provider
          value={{ drawerOpen, groups, config, updateConfig, setDrawerOpen, addScriptsButton: Button, isDragActive, setOnDrop, setAddScriptsButton }}
        >
          <DropFilesOverlay open={isDragActive && onDrop !== null} />

          {children}
        </PageContext.Provider>
      )}
    </DropScripts>
  )
}

export default PageContextProvider
