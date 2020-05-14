import Box from '@material-ui/core/Box'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import classes from './app.module.scss'
import DialogChangelog from './components/dialog-changelog/dialog-changelog'
import PageContextProvider from './components/page/page-context'
import PageDrawer from './components/page/page-drawer'
import SplashScreen from './components/splash-screen/splash-screen'
import { useOnIpcEvent } from './hooks/use-on-ipc-event'
import actions from './redux/actions'
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

      <SplashScreen />

      <PageContextProvider>
        <PageDrawer />

        <Box className={classes.content} bgcolor="background.default">
          <Routes />
        </Box>
      </PageContextProvider>
    </div>
  )
}

const App = connect((store: RootStore): StateProps => ({
  initialized: store.initialization
}), (dispatch): DispatchesProps => ({
  initialization: () => dispatch(actions.initialization.start()),
  openLogFile: () => dispatch(actions.openLogFile()),
  getLatestNotes: () => dispatch(actions.changelog.latestNotes.start()),
  setShowNotes: show => dispatch(actions.changelog.showNotes(show))
}))(Component)

export default App
