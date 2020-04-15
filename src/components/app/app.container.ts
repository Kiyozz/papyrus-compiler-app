import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { actionOpenLog } from '../../redux/actions/app/app.actions'
import App, { DispatchesProps, StateProps } from './app'
import {
  actionGetLatestNotes,
  actionSetShowNotes
} from '../../redux/actions/changelog/changelog.actions'
import { actionInitialization } from '../../redux/actions/initialization/initialization.actions'
import { RootStore } from '../../redux/stores/root.store'

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
