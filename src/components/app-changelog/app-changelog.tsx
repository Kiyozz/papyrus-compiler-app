import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { CSSTransition } from 'react-transition-group'
import AppButton from '../app-button/app-button'
import AppSnackNotification from '../app-snack-notification/app-snack-notification'
import AppTitle from '../app-title/app-title'
import './app-changelog.scss'
import useOnKeyUp from '../../hooks/use-on-key-up'
import ScrollBlock from '../scroll-block/scroll-block'

const { shell } = window.require('electron')

export interface StateProps {
  notes: string
  startingVersion: string
  latestNotesVersion: string
  showNotes: boolean
  releaseLink: string
}

export interface OwnProps {
  onClose: () => void
}

type Props = StateProps & OwnProps

const AppChangelog: React.FC<Props> = ({ onClose, notes, releaseLink, latestNotesVersion, startingVersion, showNotes }) => {
  const elementRef = useRef(null)
  const onClickClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
  }, [onClose])

  const onClickDownloadRelease = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    shell.openExternal(releaseLink)
  }, [releaseLink])

  useOnKeyUp('Escape', () => {
    onClose()
  })

  return (
    <CSSTransition
      timeout={300}
      classNames="app-fade"
      in={showNotes}
      unmountOnExit
      mountOnEnter
    >
      <ScrollBlock>
        <div className="app-changelog-popup">
          <div className="app-changelog-overlay" />
          <div className="app-changelog" ref={elementRef}>
            <AppSnackNotification>fjezakh fiuja heuifa huzG</AppSnackNotification>
            <AppTitle className="app-changelog-title">
              A new version is available
              <span
                className="app-changelog-close"
                onClick={onClickClose}
              >
            <FontAwesomeIcon icon="times" />
          </span>
            </AppTitle>

            <div className="app-changelog-content">
              <p>
                {startingVersion} <FontAwesomeIcon icon="arrow-right" size="xs" /> {latestNotesVersion}
                <AppButton className="app-changelog-download-button" onClick={onClickDownloadRelease}>
                  Download <FontAwesomeIcon icon="download" />
                </AppButton>
              </p>

              <div className="app-changelog-text">
                <ReactMarkdown source={notes} />
              </div>
            </div>
          </div>
        </div>
      </ScrollBlock>
    </CSSTransition>
  )
}

export default AppChangelog
