import React, { useCallback, useEffect, useRef, useState } from 'react'
import './app.scss'
import { CSSTransition } from 'react-transition-group'
import AppChangelog from '../app-changelog/app-changelog'
import AppSidebar from '../app-sidebar/app-sidebar'
import AppContent from '../app-content/app-content'
import AppLoading from '../../containers/app-loading/app-loading.container'

export interface StateProps {
  initialized: boolean
  version: string
  notes: string
}

export interface DispatchesProps {
  initialization: () => void
  getLatestNotes: () => void
}

type Props = StateProps & DispatchesProps

const App: React.FC<Props> = ({ initialization, initialized, version, notes, getLatestNotes }) => {
  const [showChangelog, setShowChangelog] = useState(false)
  const twiceRender = useRef<boolean>(false)

  useEffect(() => {
    initialization()
  }, [initialization])

  useEffect(() => {
    if (version !== process.env.REACT_APP_VERSION) {
      getLatestNotes()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (notes && twiceRender.current) {
      setShowChangelog(true)
    }

    twiceRender.current = true
  }, [notes])

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
          notes={notes}
          onClose={onClickCloseChangelogPopup}
        />
      </CSSTransition>

      <AppLoading />
      <AppSidebar />
      <AppContent />
    </div>
  )
}

export default App
