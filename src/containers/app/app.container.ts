import { Dispatch } from 'redux'
import { RootStore } from '../../redux/stores/root.store'
import App, { DispatchesProps, StateProps } from '../../components/app/app'
import { connect } from 'react-redux'
import { actionInitialization } from '../../redux/actions/initialization/initialization.actions'

function mapStateToProps(store: RootStore): StateProps {
  return {
    initialized: store.initialization
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    initialization: () => dispatch(actionInitialization())
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
