import React, { useCallback, useEffect, useRef, useState } from 'react'
import './app.scss'
import { CSSTransition } from 'react-transition-group'
import AppChangelog from '../app-changelog/app-changelog'
import AppSidebar from '../app-sidebar/app-sidebar'
import AppContent from '../app-content/app-content'
import AppSplashScreen from '../app-splash-screen/app-splash-screen.container'
import AppTaskLoading from '../app-task-loading/app-task-loading.container'

export interface StateProps {
  initialized: boolean
  startingVersion: string
  version: string
  notes: string
  currentVersion: string
}

export interface DispatchesProps {
  initialization: () => void
  getLatestNotes: () => void
}

type Props = StateProps & DispatchesProps

const App: React.FC<Props> = ({ initialization, initialized, version, startingVersion, notes, currentVersion, getLatestNotes }) => {
  const [showChangelog, setShowChangelog] = useState(false)
  const twiceRender = useRef<boolean>(false)

  useEffect(() => {
    initialization()
  }, [initialization])

  useEffect(() => {
    getLatestNotes()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (notes && twiceRender.current && version !== startingVersion) {
      setShowChangelog(true)
    }

    twiceRender.current = true
  }, [notes, startingVersion, version])

  const onClickCloseChangelogPopup = useCallback(() => {
    setShowChangelog(false)
  }, [setShowChangelog])

  return (
    <div className="app">
      <CSSTransition
        timeout={150}
        in={initialized && showChangelog}
        classNames="app-fade"
        mountOnEnter
        unmountOnExit
      >
        <AppChangelog
          version={version}
          currentVersion={currentVersion}
          notes={notes}
          onClose={onClickCloseChangelogPopup}
        />
      </CSSTransition>

      <AppTaskLoading />
      <AppSplashScreen />
      <AppSidebar />
      <AppContent />
    </div>
  )
}

export default App
