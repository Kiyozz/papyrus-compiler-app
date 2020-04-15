import { Button } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error'
import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import './app-compilation-logs.scss'
import AppTitle from '../app-title/app-title'
import { CompilationLogsModel } from '../../models'

export interface StateProps {
  logs: CompilationLogsModel
  popupOpen: boolean
}

export interface DispatchesProps {
  popupToggle: (toggle: boolean) => void
}

export type Props = StateProps & DispatchesProps

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
          <p>
            {scriptLogs.split('\n').map((log, i) => (
              <span key={i}>{log} <br /></span>
            ))}
          </p>
        </div>
      )
    })
  }, [logs])

  return (
    <div className="app-compilation-logs">
      <Button
        className="app-compilation-logs-button-activate"
        onClick={onClickButtonOpenLogs}
      >
        <ErrorIcon />
      </Button>

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

          <Button
            className="app-compilation-logs-button-activate"
            onClick={onClickButtonCloseLogs}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppCompilationLogs
