/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

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
import { useTranslation } from 'react-i18next'
import { Games, getExecutable } from '../../../common/game'
import { DialogTextField } from '../../components/dialog-text-field/dialog-text-field'
import { usePageContext } from '../../components/page/page-context'
import { useSettings } from './settings-context'
import classes from './settings-page.module.scss'

interface Props {
  onClickRadio: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeGameFolder: (value: string) => void
  onChangeCompilerPath: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function SettingsGame({
  onChangeGameFolder,
  onClickRadio,
  onChangeCompilerPath,
  onClickRefreshInstallation
}: Props) {
  const { t } = useTranslation()
  const {
    config: { gameType, gamePath, compilerPath }
  } = usePageContext()
  const { installationIsBad } = useSettings()
  const exe = getExecutable(gameType)

  return (
    <Paper>
      <Typography variant="h5" component="h1">
        {t('page.settings.game')}
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup row value={gameType} onChange={onClickRadio}>
          <FormControlLabel
            value={Games.LE}
            control={<Radio />}
            label={Games.LE}
          />
          <FormControlLabel
            value={Games.SE}
            control={<Radio />}
            label={Games.SE}
          />
        </RadioGroup>
      </FormControl>
      <DialogTextField
        error={installationIsBad}
        label={t('page.settings.gameFolderInfo', { gameType, exe })}
        defaultValue={gamePath}
        onChange={onChangeGameFolder}
        type="folder"
      />

      <Collapse in={installationIsBad}>
        <Alert
          severity="error"
          className={classes.alert}
          action={
            <Button
              onClick={onClickRefreshInstallation}
              startIcon={<RefreshIcon />}
            >
              {t('page.settings.actions.refresh')}
            </Button>
          }
        >
          <Typography variant="body2" paragraph className="text-selectable">
            {t('page.settings.errors.installationInvalid')}
          </Typography>
          <Typography variant="body2" className="text-selectable">
            {t('page.settings.errors.installationInvalidInfo', { exe })}
          </Typography>
        </Alert>
      </Collapse>

      <DialogTextField
        label={t('page.settings.compilerPath')}
        defaultValue={compilerPath}
        onChange={onChangeCompilerPath}
        className={classes.gap}
        type="file"
      />
    </Paper>
  )
}
