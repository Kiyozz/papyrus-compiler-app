import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { useOnIpcEvent } from './hooks/use-on-ipc-event'
import AppChangelog from './components/app-changelog/app-changelog'
import AppSidebar from './components/app-sidebar/app-sidebar'
import AppContent from './components/app-content/app-content'
import AppSplashScreen from './components/app-splash-screen/app-splash-screen'
import AppTaskLoading from './components/app-task-loading/app-task-loading'
import { actionGetLatestNotes, actionInitialization, actionOpenLog, actionSetShowNotes } from './redux/actions'
import { RootStore } from './redux/stores/root.store'
import classes from './app.module.scss'

export interface StateProps {
  initialized: boolean
}

export interface DispatchesProps {
  initialization: () => void
  getLatestNotes: () => void
  openLogFile: () => void
  setShowNotes: (show: boolean) => void
}

type Props = StateProps & DispatchesProps

const Component: React.FC<Props> = ({ initialization, initialized, setShowNotes, getLatestNotes, openLogFile }) => {
  useOnIpcEvent('open-log-file', () => {
    openLogFile()
  })

  useEffect(() => {
    initialization()
  }, [initialization])

  useEffect(() => {
    getLatestNotes()
    // eslint-disable-next-line
  }, [])

  const onClickCloseChangelogPopup = () => {
    setShowNotes(false)
  }

  return (
    <div className={classes.container}>
      {initialized && (
        <AppChangelog onClose={onClickCloseChangelogPopup} />
      )}

      <AppTaskLoading />
      <AppSplashScreen />
      <AppSidebar />
      <AppContent />
    </div>
  )
}

const App = connect((store: RootStore): StateProps => ({
  initialized: store.initialization
}), (dispatch): DispatchesProps => ({
  initialization: () => dispatch(actionInitialization()),
  getLatestNotes: () => dispatch(actionGetLatestNotes()),
  openLogFile: () => dispatch(actionOpenLog()),
  setShowNotes: show => dispatch(actionSetShowNotes(show))
}))(Component)

export default App
