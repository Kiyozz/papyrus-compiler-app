import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppContainerLogs, { DispatchesProps, OwnProps, StateProps } from './app-compilation-logs'
import { actionPopupToggle } from '../../redux/actions/compilation-logs/compilation-logs.actions'

function mapStateToProps(store: RootStore, own: OwnProps): StateProps & OwnProps {
  return {
    logs: store.compilationLogs.logs,
    popupOpen: store.compilationLogs.popupOpen,
    open: own.open
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    popupToggle: toggle => dispatch(actionPopupToggle(toggle))
  }
}

const AppContainerLogsContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainerLogs)

export default AppContainerLogsContainer
