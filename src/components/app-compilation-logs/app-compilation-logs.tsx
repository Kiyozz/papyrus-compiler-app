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
        className="btn btn-outline-secondary app-compilation-logs-button-activate"
        onClick={onClickButtonOpenLogs}
      >
        <FontAwesomeIcon icon="exclamation-circle" />
      </button>

      <div
        className={classNames({
          'app-compilation-logs-popup': true,
          'app-compilation-logs-popup-open': logsOpen
        })}
      >
        <div className="container-fluid">
          <AppTitle>Logs</AppTitle>

          <button
            className="btn btn-outline-danger app-compilation-logs-button-activate"
            onClick={onClickButtonCloseLogs}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppCompilationLogs
