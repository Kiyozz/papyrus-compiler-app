import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ErrorIcon from '@material-ui/icons/Error'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import React from 'react'
import { connect } from 'react-redux'

import { CompilationLogsModel, ScriptModel } from '../../models'
import { actionPopupToggle } from '../../redux/actions'
import { RootStore } from '../../redux/stores/root.store'

export interface StateProps {
  logs: CompilationLogsModel
  popupOpen: boolean
}

export interface OwnProps {
  open: boolean
}

export interface DispatchesProps {
  popupToggle: (toggle: boolean) => void
}

export type Props = StateProps & DispatchesProps & OwnProps

const LogsListItem: React.FC<{ script: ScriptModel, logs: string }> = ({ script, logs }) => (
  <div>
    <h2>{script.name}</h2>
    <div>
      {logs.split('\n').map((log, i) => (
        <span key={i}>{log} <br /></span>
      ))}
    </div>
  </div>
)

const Component: React.FC<Props> = ({ logs, popupOpen, popupToggle, open }) => {
  const onClickButtonOpenLogs = () => {
    popupToggle(true)
  }

  const onClickButtonCloseLogs = () => {
    popupToggle(false)
  }

  return (
    <div>
      <SpeedDialAction
        onClick={onClickButtonOpenLogs}
        icon={<ErrorIcon />}
        open={open && logs.length > 0}
        title="Open scripts logs"
      />

      <Dialog open={popupOpen} onClose={onClickButtonCloseLogs}>
        <DialogTitle>Logs</DialogTitle>
        <DialogContent>
          {
            logs.map(([script, scriptLogs], index) => (
              <LogsListItem key={index} script={script} logs={scriptLogs} />
            ))
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickButtonCloseLogs}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const CompilationLogs = connect(
  (store: RootStore, own: OwnProps): StateProps & OwnProps => ({
    logs: store.compilationLogs.logs,
    popupOpen: store.compilationLogs.popupOpen,
    open: own.open
  }),
  (dispatch): DispatchesProps => ({
    popupToggle: toggle => dispatch(actionPopupToggle(toggle))
  })
)(Component)

export default CompilationLogs
