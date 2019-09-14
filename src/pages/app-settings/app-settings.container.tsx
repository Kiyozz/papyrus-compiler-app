import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppSettings, { DispatchesProps, StateProps } from './app-settings'
import {
  actionSetGame,
  actionSetGameFolder,
  actionSetMo2Instance,
  actionSetUseMo2
} from '../../redux/actions/settings/settings.actions'

function mapStateToProps({ settings }: RootStore): StateProps {
  return {
    game: settings.game,
    gameFolder: settings.gameFolder,
    mo2: settings.mo2,
    mo2Instance: settings.mo2Instance
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    setGame: game => dispatch(actionSetGame(game)),
    setGameFolder: gameFolder => dispatch(actionSetGameFolder(gameFolder)),
    setMo2: mo2 => dispatch(actionSetUseMo2(mo2)),
    setMo2Instance: mo2Instance => dispatch(actionSetMo2Instance(mo2Instance))
  }
}

const AppSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(AppSettings)

export default AppSettingsContainer
