import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import Fade from '@material-ui/core/Fade'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import RefreshIcon from '@material-ui/icons/Refresh'
import Alert from '@material-ui/lab/Alert'

import React from 'react'

import FolderTextField from '../../components/folder-text-field/folder-text-field'
import { useSettingsContext } from './settings-context'
import classes from './settings-page.module.scss'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeMo2Instance: (value: string) => void
  onClickUpdateDetectedSourcesFolders: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SettingsMo2: React.FC<Props> = ({ onChangeMo2, onChangeMo2Instance, onClickUpdateDetectedSourcesFolders }) => {
  const { mo2, mo2Folders, mo2Instance, mo2FoldersError, limitation, loading, mo2Service } = useSettingsContext()

  const Mo2SourcesFoldersList = mo2Folders
    .map((folder) => folder.replace(`${mo2Instance}\\mods\\`, ''))
    .map((folder) => (
      <li className={classes.folder} key={folder}>{folder}</li>
    ))

  return (
    <Paper>
      <h4>Mod Organizer 2</h4>

      <FormControlLabel
        control={(
          <Checkbox
            id="mo2"
            name="mo2"
            checked={mo2}
            onChange={onChangeMo2}
          />
        )}
        label="Using Mod Organizer 2"
      />

      <Fade
        in={mo2}
        unmountOnExit
      >
        <div>
          <FolderTextField
            error={!!mo2FoldersError}
            value={mo2Instance}
            label="MO2 Instance folder"
            onChange={onChangeMo2Instance}
          />

          <Fade
            in={!!Mo2SourcesFoldersList || !!mo2FoldersError}
            unmountOnExit
          >
            <div>
              <Collapse in={!!mo2FoldersError}>
                <Alert severity="error">
                  {mo2FoldersError}
                </Alert>
              </Collapse>

              <Collapse in={!!Mo2SourcesFoldersList && !!mo2Instance}>
                <h5 className={classes.label}>
                  <span>Detected ({limitation}/{mo2Service.windowsCmdLimitation})</span>

                  <Button
                    size="small"
                    className={classes.updateFolders}
                    onClick={onClickUpdateDetectedSourcesFolders}
                    disabled={loading}
                    startIcon={<RefreshIcon />}
                  >
                    Refresh
                  </Button>
                </h5>

                <Collapse in={mo2Folders.length > 0}>
                  <ul className={classes.folders}>
                    {Mo2SourcesFoldersList}
                  </ul>
                </Collapse>
              </Collapse>
            </div>
          </Fade>
        </div>
      </Fade>
    </Paper>
  )
}

export default SettingsMo2
