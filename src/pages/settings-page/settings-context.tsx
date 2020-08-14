import React, { useMemo, useContext, createContext } from 'react'
import { Games } from '../../enums/games.enum'
import { useStoreSelector } from '../../redux/use-store-selector'
import { GameService } from '../../services/game.service'
import { Mo2Service } from '../../services/mo2.service'

interface StateProps {
  mo2: boolean
  mo2Folders: string[]
  mo2Instance: string
  game: Games
  gameFolder: string
  installationIsBad: boolean
  mo2FoldersError?: Error
  limitation?: number
  loading: boolean
  mo2Service: Mo2Service
  gameService: GameService
}

interface OwnProps {
  limitation?: number
}

type SettingsContextInterface = StateProps & OwnProps

const SettingsContext = createContext({} as SettingsContextInterface)

export const useSettings = () => useContext(SettingsContext)

const SettingsContextProvider: React.FC<OwnProps> = ({ children, ...props }) => {
  const state = useStoreSelector(({ settings, taskLoading }) => ({
    game: settings.game,
    gameFolder: settings.gameFolder,
    installationIsBad: settings.installationIsBad,
    mo2: settings.mo2,
    mo2Folders: settings.mo2SourcesFolders,
    mo2Instance: settings.mo2Instance,
    mo2FoldersError: settings.mo2DetectSourcesFoldersError,
    loading: taskLoading
  }))

  const mo2Service = useMemo(() => new Mo2Service(), [])
  const gameService = useMemo(() => new GameService(), [])

  const value = useMemo(() => ({
    ...props,
    ...state,
    mo2Service,
    gameService
  }), [state, props, mo2Service, gameService])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContextProvider
