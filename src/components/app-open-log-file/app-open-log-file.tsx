import BugReportIcon from '@material-ui/icons/BugReport'
import Button from '@material-ui/core/Button'
import React, { useCallback } from 'react'
import './app-open-log-file.scss'

export interface StateProps {
}

export interface DispatchesProps {
  openLogFile: () => void
}

type Props = StateProps & DispatchesProps

const AppOpenLogFile: React.FC<Props> = ({ openLogFile }) => {
  const onClickButtonOpenLogFile = useCallback(() => {
    openLogFile()
  }, [openLogFile])

  return (
    <Button
      color="secondary"
      className="app-open-log-file-button-activate"
      onClick={onClickButtonOpenLogFile}
    >
      <BugReportIcon />
    </Button>
  )
}

export default AppOpenLogFile
