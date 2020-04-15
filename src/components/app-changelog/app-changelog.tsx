import CloseIcon from '@material-ui/icons/Close'
import DownloadIcon from '@material-ui/icons/GetApp'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import React, { useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { CSSTransition } from 'react-transition-group'
import AppButton from '../app-button/app-button'
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
          <div className="app-changelog">
            <AppTitle className="app-changelog-title">
              A new version is available
              <span
                className="app-changelog-close"
                onClick={onClickClose}
              >
            <CloseIcon />
          </span>
            </AppTitle>

            <div className="app-changelog-content">
              <p>
                {startingVersion} <ArrowForwardIcon /> {latestNotesVersion}
                <AppButton className="app-changelog-download-button" onClick={onClickDownloadRelease}>
                  Download <DownloadIcon />
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
