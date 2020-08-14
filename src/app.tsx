import Box from '@material-ui/core/Box'
import React, { useCallback, useEffect } from 'react'

import classes from './app.module.scss'
import DialogChangelog from './components/dialog-changelog/dialog-changelog'
import PageContextProvider from './components/page/page-context'
import PageDrawer from './components/page/page-drawer'
import SplashScreen from './components/splash-screen/splash-screen'
import { useOnIpcEvent } from './hooks/use-on-ipc-event'
import actions from './redux/actions'
import { useActions, useStoreSelector } from './redux/use-store-selector'
import Routes from './routes'

export interface DispatchesProps {
  initialization: () => void
  getLatestNotes: () => void
  openLogFile: () => void
  setShowNotes: (show: boolean) => void
}

const useAppActions = () =>
  useActions<DispatchesProps>({
    initialization: actions.initialization.start,
    openLogFile: actions.openLogFile,
    getLatestNotes: actions.changelog.latestNotes.start,
    setShowNotes: actions.changelog.showNotes
  })

const App: React.FC = () => {
  const { initialization, getLatestNotes, setShowNotes, openLogFile } = useAppActions()
  const initialized = useStoreSelector(state => state.initialization)
  const onLogFileOpen = useCallback(() => {
    openLogFile()
  }, [openLogFile])

  useOnIpcEvent('open-log-file', onLogFileOpen)

  useEffect(() => {
    initialization()
  }, [initialization])

  useEffect(() => {
    getLatestNotes()
    // eslint-disable-next-line
  }, [])

  const onClickCloseChangelogPopup = useCallback(() => {
    setShowNotes(false)
  }, [setShowNotes])

  return (
    <div className={classes.container}>
      {initialized && <DialogChangelog onClose={onClickCloseChangelogPopup} />}

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

export default App
