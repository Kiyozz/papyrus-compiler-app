import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppCompilation, { DispatchesProps, StateProps } from '../../pages/app-compilation/app-compilation'

function mapStateToProps(store: RootStore): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppCompilationContainer = connect(mapStateToProps, mapDispatchToProps)(AppCompilation)

export default AppCompilationContainer
