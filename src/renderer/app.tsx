import Box from '@material-ui/core/Box'
import React, { useCallback, useEffect } from 'react'

import classes from './app.module.scss'
import { DialogChangelog } from './components/dialog-changelog/dialog-changelog'
import PageContextProvider from './components/page/page-context'
import { PageDrawer } from './components/page/page-drawer'
import { SplashScreen } from './components/splash-screen/splash-screen'
import actions from './redux/actions'
import { useAction, useStoreSelector } from './redux/use-store-selector'
import { Routes } from './routes'

function App() {
  const initialization = useAction(actions.initialization.start)
  const getLatestNotes = useAction(actions.changelog.latestNotes.start)
  const setShowNotes = useAction(actions.changelog.showNotes)
  const initialized = useStoreSelector(state => state.initialization)

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
