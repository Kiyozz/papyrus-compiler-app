import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import App, { DispatchesProps, StateProps } from '../../components/app/app'
import { actionGetLatestNotes } from '../../redux/actions/changelog/changelog.actions'
import { actionInitialization } from '../../redux/actions/initialization/initialization.actions'
import { RootStore } from '../../redux/stores/root.store'

function mapStateToProps(store: RootStore): StateProps {
  return {
    initialized: store.initialization,
    version: store.changelog.version,
    notes: store.changelog.notes
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    initialization: () => dispatch(actionInitialization()),
    getLatestNotes: () => dispatch(actionGetLatestNotes())
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
