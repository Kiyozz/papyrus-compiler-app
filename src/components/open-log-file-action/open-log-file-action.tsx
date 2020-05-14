import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import BugReportIcon from '@material-ui/icons/BugReport'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import actions from '../../redux/actions'

export interface DispatchesProps {
  openLogFile: () => void
}

type Props = DispatchesProps

const Component: React.FC<Props> = ({ openLogFile }) => {
  const onClickButtonOpenLogFile = useCallback(() => {
    openLogFile()
  }, [openLogFile])

  return (
    <ListItem button onClick={onClickButtonOpenLogFile}>
      <ListItemIcon>
        <BugReportIcon />
      </ListItemIcon>
      <ListItemText primary="Application logs" />
    </ListItem>
  )
}

const OpenLogFileAction = connect(
  undefined,
  (dispatch): DispatchesProps => ({
    openLogFile: () => dispatch(actions.openLogFile())
  })
)(Component)

export default OpenLogFileAction
