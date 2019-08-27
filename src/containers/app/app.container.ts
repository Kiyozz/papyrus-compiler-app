import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import App, { DispatchesProps, StateProps } from '../../components/app/app'
import { actionInitialization } from '../../redux/actions/initialization/initialization.actions'
import { RootStore } from '../../redux/stores/root.store'

function mapStateToProps(store: RootStore): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    initialization: () => dispatch(actionInitialization())
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
