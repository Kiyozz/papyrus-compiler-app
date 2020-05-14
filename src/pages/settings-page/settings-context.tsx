import React from 'react'
import { connect } from 'react-redux'
import { Games } from '../../enums/games.enum'
import { RootStore } from '../../redux/stores/root.store'
import { GameService } from '../../services/game.service'
import { Mo2Service } from '../../services/mo2.service'

interface SettingsContextInterface {
  mo2: boolean
  mo2Folders: string[]
  mo2Instance: string
  game: Games
  gameFolder: string
  installationIsBad: boolean
  mo2FoldersError?: string
  limitation?: number
  loading: boolean
  mo2Service: Mo2Service
  gameService: GameService
}

interface OwnProps {
  limitation?: number
}

const SettingsContext = React.createContext({} as SettingsContextInterface)

export const useSettingsContext = () => React.useContext(SettingsContext)

const Provider: React.FC<SettingsContextInterface> = ({ children, ...props }) => {
  return (
    <SettingsContext.Provider value={props}>
      {children}
    </SettingsContext.Provider>
  )
}

const SettingsContextProvider = connect(
  ({ settings, taskLoading }: RootStore, own: OwnProps): SettingsContextInterface => ({
    game: settings.game,
    gameFolder: settings.gameFolder,
    installationIsBad: settings.installationIsBad,
    limitation: own.limitation,
    mo2: settings.mo2,
    mo2Folders: settings.mo2SourcesFolders,
    mo2Instance: settings.mo2Instance,
    mo2FoldersError: settings.mo2DetectSourcesFoldersError,
    loading: taskLoading,
    mo2Service: new Mo2Service(),
    gameService: new GameService()
  })
)(Provider)

export default SettingsContextProvider
