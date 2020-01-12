import React, { useCallback } from 'react'
import './app-open-log-file.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
    <div className="app-open-log-file">
      <button
        className="btn btn-outline-secondary app-open-log-file-button-activate d-flex justify-content-center align-items-center"
        onClick={onClickButtonOpenLogFile}
      >
        <FontAwesomeIcon icon="file" />
      </button>
    </div>
  )
}

export default AppOpenLogFile
