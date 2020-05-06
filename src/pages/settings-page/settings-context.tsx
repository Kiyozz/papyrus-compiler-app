import React from 'react'
import { connect } from 'react-redux'
import { Games } from '../../enums/games.enum'
import { RootStore } from '../../redux/stores/root.store'
import { Mo2Service } from '../../services/mo2.service'

interface SettingsContextInterface {
  mo2: boolean
  mo2Folders: string[]
  mo2Instance: string
  game: Games
  installationIsBad: boolean
  mo2FoldersError?: string
  limitation?: number
  loading: boolean
  mo2Service: Mo2Service
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
  ({ settings, error, taskLoading }: RootStore, own: OwnProps): SettingsContextInterface => ({
    game: settings.game,
    installationIsBad: settings.installationIsBad,
    limitation: own.limitation,
    mo2: settings.mo2,
    mo2Folders: settings.mo2SourcesFolders,
    mo2Instance: settings.mo2Instance,
    mo2FoldersError: error.detectSourcesFoldersFailed,
    loading: taskLoading,
    mo2Service: new Mo2Service()
  })
)(Provider)

export default SettingsContextProvider
