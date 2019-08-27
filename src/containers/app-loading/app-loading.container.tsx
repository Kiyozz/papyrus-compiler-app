import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppLoading, { DispatchesProps, StateProps } from '../../components/app-loading/app-loading'

function mapStateToProps(store: RootStore): StateProps {
  return {
    initialized: store.initialization
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppLoadingContainer = connect(mapStateToProps, mapDispatchToProps)(AppLoading)

export default AppLoadingContainer
