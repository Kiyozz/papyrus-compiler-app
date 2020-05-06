import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import RefreshIcon from '@material-ui/icons/Refresh'
import Alert from '@material-ui/lab/Alert'

import React from 'react'

import FolderTextField from '../../components/folder-text-field/folder-text-field'
import { useSettingsContext } from './settings-context'
import SettingsMo2List from './settings-mo2-list'
import classes from './settings-page.module.scss'

interface Props {
  onChangeMo2Instance: (value: string) => void
  onClickUpdateDetectedSourcesFolders: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SettingsMo2Instance: React.FC<Props> = ({ onChangeMo2Instance, onClickUpdateDetectedSourcesFolders }) => {
  const { mo2, mo2Folders, mo2FoldersError, mo2Instance, limitation, mo2Service, loading } = useSettingsContext()

  return (
    <Collapse in={mo2}>
      <FolderTextField
        error={!!mo2FoldersError}
        value={mo2Instance}
        label="MO2 Instance folder"
        onChange={onChangeMo2Instance}
      />

      <Collapse in={!!mo2FoldersError}>
        <Alert severity="error">
          {mo2FoldersError}
        </Alert>
      </Collapse>

      <Collapse in={mo2Folders.length > 0 && !!mo2Instance}>
        <div className={classes.foldersList}>
          <Button
            size="small"
            onClick={onClickUpdateDetectedSourcesFolders}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </div>

        <SettingsMo2List limitationText={`Limit ${limitation}/${mo2Service.windowsCmdLimitation}`} />
      </Collapse>
    </Collapse>
  )
}

export default SettingsMo2Instance
