import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppSettings, { DispatchesProps, StateProps } from './app-settings'
import {
  actionDetectMo2SourcesFolders,
  actionSetGame,
  actionSetGameFolder,
  actionSetMo2Instance,
  actionSetUseMo2
} from '../../redux/actions/settings/settings.actions'

function mapStateToProps({ settings, taskLoading: loading, error }: RootStore): StateProps {
  return {
    game: settings.game,
    gameFolder: settings.gameFolder,
    mo2: settings.mo2,
    mo2Instance: settings.mo2Instance,
    detectedMo2SourcesFolders: settings.mo2SourcesFolders,
    loading,
    detectSourcesFoldersError: error.detectSourcesFoldersFailed
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    setGame: game => dispatch(actionSetGame(game)),
    setGameFolder: gameFolder => dispatch(actionSetGameFolder(gameFolder)),
    setMo2: mo2 => dispatch(actionSetUseMo2(mo2)),
    setMo2Instance: mo2Instance => dispatch(actionSetMo2Instance(mo2Instance)),
    detectMo2SourcesFolder: (mo2Instance, game) => dispatch(actionDetectMo2SourcesFolders([mo2Instance, game]))
  }
}

const AppSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(AppSettings)

export default AppSettingsContainer
