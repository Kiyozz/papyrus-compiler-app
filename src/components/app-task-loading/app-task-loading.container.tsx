import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppTaskLoading, { DispatchesProps, StateProps } from '../../components/app-task-loading/app-task-loading'

function mapStateToProps(store: RootStore): StateProps {
  return {
    loading: store.taskLoading
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppTaskLoadingContainer = connect(mapStateToProps, mapDispatchToProps)(AppTaskLoading)

export default AppTaskLoadingContainer
