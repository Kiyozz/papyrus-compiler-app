import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ErrorIcon from '@material-ui/icons/Error'

import React from 'react'
import { connect } from 'react-redux'

import { CompilationLogsModel, ScriptModel } from '../../models'
import actions from '../../redux/actions'
import { RootStore } from '../../redux/stores/root.store'

interface StateProps {
  logs: CompilationLogsModel
  popupOpen: boolean
}

interface DispatchesProps {
  popupToggle: (toggle: boolean) => void
}

export type Props = StateProps & DispatchesProps

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

const Component: React.FC<Props> = ({ logs, popupOpen, popupToggle }) => {
  const onClickButtonOpenLogs = () => {
    popupToggle(true)
  }

  const onClickButtonCloseLogs = () => {
    popupToggle(false)
  }

  return (
    <>
      <ListItem button onClick={onClickButtonOpenLogs}>
        <ListItemIcon>
          <ErrorIcon />
        </ListItemIcon>
        <ListItemText primary="Compilation logs" />
      </ListItem>

      <Dialog open={popupOpen} onClose={onClickButtonCloseLogs}>
        <DialogTitle>Compilation logs</DialogTitle>
        <DialogContent>
          {logs.length > 0 ? (
            logs.map(([script, scriptLogs], index) => (
              <LogsListItem key={index} script={script} logs={scriptLogs} />
            ))
          ) : (
            'No logs'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickButtonCloseLogs}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const OpenCompilationLogs = connect(
  (store: RootStore): StateProps => ({
    logs: store.compilationLogs.logs,
    popupOpen: store.compilationLogs.popupOpen
  }),
  (dispatch): DispatchesProps => ({
    popupToggle: toggle => dispatch(actions.compilationPage.logs.popupToggle(toggle))
  })
)(Component)

export default OpenCompilationLogs
