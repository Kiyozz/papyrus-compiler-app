/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Button, Tooltip, Alert, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  GameType,
  toCompilerSourceFile,
  toExecutable,
} from '../../../common/game'
import DialogTextField from '../../components/dialog/dialog-text-field'
import { useApp } from '../../hooks/use-app'
import SettingsSection from './settings-section'
import { useSettings } from './use-settings'

interface SettingsGameProps {
  onClickRadio: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeGameFolder: (value: string) => void
  onChangeCompilerPath: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function SettingsGame({
  onChangeGameFolder,
  onClickRadio,
  onChangeCompilerPath,
  onClickRefreshInstallation,
}: SettingsGameProps) {
  const { t } = useTranslation()
  const {
    config: { game, compilation },
  } = useApp()
  const { configError } = useSettings()
  const exe = toExecutable(game.type)

  return (
    <SettingsSection gutterTop={false} title={t('page.settings.game')}>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          classes={{ row: 'justify-between' }}
          onChange={onClickRadio}
          row
          value={game.type}
        >
          <FormControlLabel
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.le}
            value={GameType.le}
          />
          <FormControlLabel
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.se}
            value={GameType.se}
          />
          <FormControlLabel
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.vr}
            value={GameType.vr}
          />
          <FormControlLabel
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.fo4}
            value={GameType.fo4}
          />
        </RadioGroup>
      </FormControl>

      <div className="mt-3" id="settings-game">
        <DialogTextField
          defaultValue={game.path}
          error={configError === 'game'}
          id="game-path"
          label={
            <>
              {t('page.settings.gameFolderInfo')}
              <Tooltip
                title={t<string>('page.settings.gameFolderTooltip', { exe })}
              >
                <HelpIcon className="ml-1" />
              </Tooltip>
            </>
          }
          onChange={onChangeGameFolder}
          type="folder"
        />
      </div>

      <div className="relative mt-3" id="settings-compiler">
        <DialogTextField
          defaultValue={compilation.compilerPath}
          error={configError === 'compiler'}
          id="compiler-path"
          label={
            <>
              {t('page.settings.compilerPath')}
              <Tooltip title={t<string>('page.settings.compilerPathTooltip')}>
                <HelpIcon className="ml-1" />
              </Tooltip>
            </>
          }
          onChange={onChangeCompilerPath}
          type="file"
        />
      </div>

      {configError !== false &&
        configError !== 'mo2-instance' &&
        configError !== 'mo2-instance-mods' && (
          <Alert className="mt-3" severity="error">
            <Typography className="select-text" gutterBottom>
              {t('page.settings.errors.installationInvalid')}
            </Typography>

            <Typography className="select-text" gutterBottom>
              {configError === 'game' &&
                t('page.settings.errors.game', { exe })}
              {configError === 'compiler' &&
                t('page.settings.errors.compiler', {
                  compilerExe: compilation.compilerPath,
                })}
              {configError === 'scripts' &&
                t('page.settings.errors.scripts', {
                  file: toCompilerSourceFile(game.type),
                })}
            </Typography>
            <Button
              onClick={onClickRefreshInstallation}
              startIcon={<RefreshIcon />}
            >
              {t('common.refresh')}
            </Button>
          </Alert>
        )}
    </SettingsSection>
  )
}

export default SettingsGame
