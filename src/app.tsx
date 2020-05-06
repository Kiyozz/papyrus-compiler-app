import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import classes from './app.module.scss'
import PageContextProvider from './components/page/page-context'
import PageDrawer from './components/page/page-drawer'
import Sidebar from './components/sidebar/sidebar'
import SplashScreen from './components/splash-screen/splash-screen'
import LoadingIndicator from './components/loading-indicator/loading-indicator'
import DialogChangelog from './components/dialog-changelog/dialog-changelog'
import { useOnIpcEvent } from './hooks/use-on-ipc-event'
import { actionGetLatestNotes, actionInitialization, actionOpenLog, actionSetShowNotes } from './redux/actions'
import { RootStore } from './redux/stores/root.store'
import Routes from './routes'

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
        <DialogChangelog onClose={onClickCloseChangelogPopup} />
      )}

      <LoadingIndicator />
      <SplashScreen />

      <PageContextProvider>
        <PageDrawer />

        <main className={classes.content}>
          <Routes />
        </main>
      </PageContextProvider>
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
