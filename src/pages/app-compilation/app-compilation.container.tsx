import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppCompilation, { DispatchesProps, StateProps } from './app-compilation'
import {
  actionSetCompilationScripts,
  actionStartCompilation
} from '../../redux/actions/compilation/compilation.actions'

function mapStateToProps(store: RootStore): StateProps {
  return {
    isCompilationRunning: store.compilation.isCompilationRunning,
    compilationScripts: store.compilation.compilationScripts
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    startCompilation: scripts => dispatch(actionStartCompilation(scripts)),
    setCompilationScripts: scripts => dispatch(actionSetCompilationScripts(scripts))
  }
}

const AppCompilationContainer = connect(mapStateToProps, mapDispatchToProps)(AppCompilation)

export default AppCompilationContainer
