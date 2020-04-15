import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  actionOpenLog,
  actionGetLatestNotes,
  actionSetShowNotes,
  actionInitialization
} from './redux/actions'
import App, { DispatchesProps, StateProps } from './app'
import { RootStore } from './redux/stores/root.store'

function mapStateToProps(store: RootStore): StateProps {
  return {
    initialized: store.initialization
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    initialization: () => dispatch(actionInitialization()),
    getLatestNotes: () => dispatch(actionGetLatestNotes()),
    openLogFile: () => dispatch(actionOpenLog()),
    setShowNotes: show => dispatch(actionSetShowNotes(show))
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
