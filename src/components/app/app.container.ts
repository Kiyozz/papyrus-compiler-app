import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { actionOpenLog } from '../../redux/actions/app/app.actions'
import App, { DispatchesProps, StateProps } from './app'
import { actionGetLatestNotes, actionSetLatestVersion } from '../../redux/actions/changelog/changelog.actions'
import { actionInitialization } from '../../redux/actions/initialization/initialization.actions'
import { RootStore } from '../../redux/stores/root.store'

function mapStateToProps(store: RootStore): StateProps {
  return {
    initialized: store.initialization,
    startingVersion: store.changelog.startingVersion,
    version: store.changelog.version,
    notes: store.changelog.notes,
    currentVersion: process.env.REACT_APP_VERSION || ''
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    initialization: () => dispatch(actionInitialization()),
    getLatestNotes: () => dispatch(actionGetLatestNotes()),
    setLatestVersion: () => dispatch(actionSetLatestVersion(process.env.REACT_APP_VERSION || '')),
    openLogFile: () => dispatch(actionOpenLog())
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
