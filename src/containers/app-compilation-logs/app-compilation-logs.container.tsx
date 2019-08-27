import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppContainerLogs, { DispatchesProps, StateProps } from '../../components/app-compilation-logs/app-compilation-logs'

function mapStateToProps(store: RootStore): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppContainerLogsContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainerLogs)

export default AppContainerLogsContainer
