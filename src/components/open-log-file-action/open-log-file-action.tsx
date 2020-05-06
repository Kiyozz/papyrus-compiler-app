import BugReportIcon from '@material-ui/icons/BugReport'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { actionOpenLog } from '../../redux/actions'

export interface OwnProps {
  open: boolean
}

export interface DispatchesProps {
  openLogFile: () => void
}

type Props = DispatchesProps & OwnProps

const Component: React.FC<Props> = ({ openLogFile, open }) => {
  const onClickButtonOpenLogFile = useCallback(() => {
    openLogFile()
  }, [openLogFile])

  return (
    <SpeedDialAction
      onClick={onClickButtonOpenLogFile}
      title="Open app logs file"
      open={open}
      icon={<BugReportIcon />}
    />
  )
}

const OpenLogFileAction = connect(
  (_: any, own: OwnProps): OwnProps => own,
  (dispatch): DispatchesProps => ({
    openLogFile: () => dispatch(actionOpenLog())
  })
)(Component)

export default OpenLogFileAction
