import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppContainerLogs, { DispatchesProps, StateProps } from '../../components/app-compilation-logs/app-compilation-logs'
import { actionPopupToggle } from '../../redux/actions/compilation-logs/compilation-logs.actions'

function mapStateToProps(store: RootStore): StateProps {
  return {
    logs: store.compilationLogs.logs,
    popupOpen: store.compilationLogs.popupOpen
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    popupToggle: toggle => dispatch(actionPopupToggle(toggle))
  }
}

const AppContainerLogsContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainerLogs)

export default AppContainerLogsContainer
