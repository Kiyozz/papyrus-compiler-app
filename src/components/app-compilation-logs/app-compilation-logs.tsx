import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import './app-compilation-logs.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppTitle from '../app-title/app-title'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppCompilationLogs: React.FC<Props> = () => {
  const [logsOpen, setLogsOpen] = useState(false)
  const onClickButtonOpenLogs = useCallback(() => {
    setLogsOpen(true)
  }, [setLogsOpen])
  const onClickButtonCloseLogs = useCallback(() => {
    setLogsOpen(false)
  }, [setLogsOpen])

  return (
    <div className="app-compilation-logs">
      <button
        className="app-compilation-logs-button-activate"
        onClick={onClickButtonOpenLogs}
      >
        <FontAwesomeIcon icon="exclamation-circle" /> Logs
      </button>

      <div
        className={classNames({
          'app-compilation-logs-popup': true,
          'app-compilation-logs-popup-open': logsOpen
        })}
      >
        <AppTitle>Logs</AppTitle>

        <button className="app-compilation-logs-button-activate" onClick={onClickButtonCloseLogs}>Close</button>
      </div>
    </div>
  )
}

export default AppCompilationLogs
