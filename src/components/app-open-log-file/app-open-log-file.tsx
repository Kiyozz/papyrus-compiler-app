import BugReportIcon from '@material-ui/icons/BugReport'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import React, { useCallback } from 'react'
import './app-open-log-file.scss'

export interface StateProps {
}

export interface OwnProps {
  open: boolean
}

export interface DispatchesProps {
  openLogFile: () => void
}

type Props = StateProps & DispatchesProps & OwnProps

const AppOpenLogFile: React.FC<Props> = ({ openLogFile, open }) => {
  const onClickButtonOpenLogFile = useCallback(() => {
    openLogFile()
  }, [openLogFile])

  return (
    <SpeedDialAction
      onClick={onClickButtonOpenLogFile}
      title="Open app logs file"
      tooltipOpen
      tooltipTitle="Logs file"
      open={open}
      icon={<BugReportIcon />}
    />
  )
}

export default AppOpenLogFile
