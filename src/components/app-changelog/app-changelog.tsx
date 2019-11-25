import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import AppTitle from '../app-title/app-title'
import './app-changelog.scss'
import useOnKeyUp from '../../hooks/use-on-key-up'
import useStopScroll from '../../hooks/use-stop-scroll'

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
        <AppTitle className="app-changelog-title">Version {version}{CurrentVersionInfo}</AppTitle>

        <span
          className="app-changelog-close"
          onClick={onClickClose}
        >
          <FontAwesomeIcon icon="times" />
        </span>

        <div className="app-changelog-text">
          {Notes}
        </div>
      </div>
    </div>
  )
}

export default AppChangelog
