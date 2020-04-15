import React, { useCallback, useEffect } from 'react'
import './app.scss'
import { useOnIpcEvent } from '../../hooks/use-on-ipc-event'
import AppChangelog from '../app-changelog/app-changelog-container'
import AppSidebar from '../app-sidebar/app-sidebar'
import AppContent from '../app-content/app-content'
import AppSplashScreen from '../app-splash-screen/app-splash-screen.container'
import AppTaskLoading from '../app-task-loading/app-task-loading.container'

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

const App: React.FC<Props> = ({ initialization, initialized, setShowNotes, getLatestNotes, openLogFile }) => {
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

  const onClickCloseChangelogPopup = useCallback(() => {
    setShowNotes(false)
  }, [setShowNotes])

  return (
    <div className="app">
      {initialized && (
        <AppChangelog
          onClose={onClickCloseChangelogPopup}
        />
      )}

      <AppTaskLoading />
      <AppSplashScreen />
      <AppSidebar />
      <AppContent />
    </div>
  )
}

export default App
