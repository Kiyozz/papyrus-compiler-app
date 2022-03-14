/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Tooltip } from '@mui/material'
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
import Alert from '../../components/alert'
import DialogTextField from '../../components/dialog/dialog-text-field'
import { useApp } from '../../hooks/use-app'
import { useSettings } from './use-settings'

type Props = {
  onClickRadio: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeGameFolder: (value: string) => void
  onChangeCompilerPath: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SettingsGame = ({
  onChangeGameFolder,
  onClickRadio,
  onChangeCompilerPath,
  onClickRefreshInstallation,
}: Props) => {
  const { t } = useTranslation()
  const {
    config: { game, compilation },
  } = useApp()
  const { configError } = useSettings()
  const exe = toExecutable(game.type)

  return (
    <div className="paper relative" id="settings-game">
      <h1 className="text-3xl dark:text-white mb-3">
        {t('page.settings.game')}
      </h1>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          row
          value={game.type}
          onChange={onClickRadio}
          classes={{ row: 'justify-between' }}
        >
          <FormControlLabel
            value={GameType.le}
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.le}
          />
          <FormControlLabel
            value={GameType.se}
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.se}
          />
          <FormControlLabel
            value={GameType.vr}
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.vr}
          />
          <FormControlLabel
            value={GameType.fo4}
            classes={{
              label: 'dark:text-white',
            }}
            control={<Radio />}
            label={GameType.fo4}
          />
        </RadioGroup>
      </FormControl>

      <div className="mt-3">
        <DialogTextField
          id="game-folder"
          error={configError === 'game'}
          label={
            <>
              {t('page.settings.gameFolderInfo')}
              <Tooltip
                title={t<string>('page.settings.gameFolderTooltip', { exe })}
              >
                <HelpIcon fontSize="inherit" classes={{ root: 'ml-1' }} />
              </Tooltip>
            </>
          }
          defaultValue={game.path}
          onChange={onChangeGameFolder}
          type="folder"
        />
      </div>

      <div className="mt-3 relative" id="settings-compiler">
        <DialogTextField
          id="compiler-path"
          error={configError === 'compiler'}
          label={
            <>
              {t('page.settings.compilerPath')}
              <Tooltip title={t<string>('page.settings.compilerPathTooltip')}>
                <HelpIcon fontSize="inherit" classes={{ root: 'ml-1' }} />
              </Tooltip>
            </>
          }
          defaultValue={compilation.compilerPath}
          onChange={onChangeCompilerPath}
          type="file"
        />
      </div>

      {configError !== false && configError !== 'mo2-instance' && (
        <Alert>
          <div className="w-full">
            <p className="select-text mb-2">
              {t('page.settings.errors.installationInvalid')}
            </p>

            <p className="select-text">
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
            </p>
          </div>
          <div>
            <button className="btn mr-2" onClick={onClickRefreshInstallation}>
              <div className="icon">
                <RefreshIcon />
              </div>
              {t('common.refresh')}
            </button>
          </div>
        </Alert>
      )}
    </div>
  )
}

export default SettingsGame
