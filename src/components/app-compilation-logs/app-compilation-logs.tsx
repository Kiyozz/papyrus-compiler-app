import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import './app-compilation-logs.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppTitle from '../app-title/app-title'
import { CompilationLogsModel } from '../../models'

export interface StateProps {
  logs: CompilationLogsModel
  popupOpen: boolean
}

export interface DispatchesProps {
  popupToggle: (toggle: boolean) => void
}

type Props = StateProps & DispatchesProps

const AppCompilationLogs: React.FC<Props> = ({ logs, popupOpen, popupToggle }) => {
  const onClickButtonOpenLogs = useCallback(() => {
    popupToggle(true)
  }, [popupToggle])
  const onClickButtonCloseLogs = useCallback(() => {
    popupToggle(false)
  }, [popupToggle])

  const LogsList = useMemo(() => {
    return logs.map(([script, scriptLogs], index) => {
      return (
        <div
          key={index}
          className="app-compilation-logs-logs-section"
        >
          <h2>{script.name}</h2>
          <p>{scriptLogs}</p>
        </div>
      )
    })
  }, [logs])

  return (
    <div className="app-compilation-logs">
      <button
        className="btn btn-outline-secondary app-compilation-logs-button-activate d-flex justify-content-center align-items-center"
        onClick={onClickButtonOpenLogs}
      >
        <FontAwesomeIcon icon="exclamation-circle" />
      </button>

      <div
        className={classNames({
          'app-compilation-logs-popup': true,
          'app-compilation-logs-popup-open': popupOpen
        })}
      >
        <div className="container-fluid d-flex flex-column h-100 overflow-auto">
          <AppTitle className="app-compilation-logs-title">Logs</AppTitle>

          <div className="app-compilation-logs-logs-container">
            <div className="app-compilation-logs-logs-section">
              {LogsList}
            </div>
          </div>

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
