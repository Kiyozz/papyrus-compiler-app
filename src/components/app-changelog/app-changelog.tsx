import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import AppButton from '../app-button/app-button'
import AppTitle from '../app-title/app-title'
import './app-changelog.scss'
import useOnKeyUp from '../../hooks/use-on-key-up'
import useStopScroll from '../../hooks/use-stop-scroll'

const { shell } = window.require('electron')

interface Props {
  version: string
  currentVersion?: string | undefined
  notes: string
  onClose: () => void
}

const AppChangelog: React.FC<Props> = ({ version, notes, currentVersion, onClose }) => {
  const Notes = <ReactMarkdown source={notes} />

  const onClickClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
  }, [onClose])

  const releaseLink = useMemo(() => `https://www.nexusmods.com/skyrim/mods/96339?tab=files`, [])
  const onClickDownloadRelease = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    shell.openExternal(releaseLink)
  }, [releaseLink])

  useOnKeyUp('Escape', () => {
    onClose()
  })
  useStopScroll()

  const CurrentVersionInfo = useMemo(() => {
    if (!currentVersion || currentVersion === version) {
      return null
    }

    return <span className="app-changelog-update-text">(Update available)</span>
  }, [currentVersion, version])

  return (
    <div className="app-changelog-popup">
      <div className="app-changelog-overlay" />
      <div className="app-changelog">
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
            Version {version}{CurrentVersionInfo}
            <AppButton className="app-changelog-download-button" onClick={onClickDownloadRelease}>
              Download <FontAwesomeIcon icon="download" />
            </AppButton>
          </p>

          <div className="app-changelog-text">
            {Notes}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppChangelog
