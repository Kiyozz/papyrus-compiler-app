import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'
import RefreshIcon from '@material-ui/icons/Refresh'
import Alert from '@material-ui/lab/Alert'
import React from 'react'
import FolderTextField from '../../components/folder-text-field/folder-text-field'
import { Games } from '../../enums/games.enum'
import { useSettingsContext } from './settings-context'
import classes from './settings-page.module.scss'

interface Props {
  onClickRadio: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeGameFolder: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SettingsGame: React.FC<Props> = ({ onChangeGameFolder, onClickRadio, onClickRefreshInstallation }) => {
  const { game, installationIsBad, gameFolder, gameService } = useSettingsContext()

  return (
    <Paper>
      <Typography variant="h5" component="h1">Game</Typography>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup row value={game} onChange={onClickRadio}>
          <FormControlLabel value={Games.LE} control={<Radio />} label={Games.LE} />
          <FormControlLabel value={Games.SE} control={<Radio />} label={Games.SE} />
        </RadioGroup>
      </FormControl>
      <FolderTextField
        error={installationIsBad}
        label={`${game} folder (where ${gameService.toExecutable(game)} is located)`}
        value={gameFolder}
        onChange={onChangeGameFolder}
      />

      <Collapse in={installationIsBad}>
        <Alert
          severity="error"
          className={classes.alert}
          action={(
            <Button onClick={onClickRefreshInstallation} startIcon={<RefreshIcon />}>
              Refresh
            </Button>
          )}
        >
          <div>Installation seems invalid.</div>
          <div>Checks that you have extracted Scripts.zip from Creation Kit</div>
        </Alert>
      </Collapse>
    </Paper>
  )
}

export default SettingsGame
