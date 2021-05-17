/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import RefreshIcon from '@material-ui/icons/Refresh'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  GameType,
  toCompilerSourceFile,
  toExecutable,
} from '../../../common/game'
import { Alert } from '../../components/alert'
import { DialogTextField } from '../../components/dialog/dialog-text-field'
import { useApp } from '../../hooks/use-app'
import { useSettings } from './settings-context'

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
  onClickRefreshInstallation,
}: Props): JSX.Element {
  const { t } = useTranslation()
  const {
    config: { game, compilation },
  } = useApp()
  const { isBadInstallation } = useSettings()
  const exe = toExecutable(game.type)

  return (
    <div className="paper relative" id="settings-game">
      <h1 className="text-2xl dark:text-white mb-3">
        {t('page.settings.game')}
      </h1>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup row value={game.type} onChange={onClickRadio}>
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
          error={isBadInstallation === 'game'}
          label={t('page.settings.gameFolderInfo', {
            gameType: game.type,
            exe,
          })}
          defaultValue={game.path}
          onChange={onChangeGameFolder}
          type="folder"
        />
      </div>

      <div className="mt-3 relative" id="settings-compiler">
        <DialogTextField
          id="compiler-path"
          error={isBadInstallation === 'compiler'}
          label={t('page.settings.compilerPath')}
          defaultValue={compilation.compilerPath}
          onChange={onChangeCompilerPath}
          type="file"
        />
      </div>

      {isBadInstallation !== false && isBadInstallation !== 'mo2-instance' && (
        <Alert>
          <div className="w-full">
            <p className="select-text mb-2">
              {t('page.settings.errors.installationInvalid')}
            </p>

            <p className="select-text">
              {isBadInstallation === 'game' &&
                t('page.settings.errors.game', { exe })}
              {isBadInstallation === 'compiler' &&
                t('page.settings.errors.compiler', {
                  compilerExe: compilation.compilerPath,
                })}
              {isBadInstallation === 'scripts' &&
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
              {t('page.settings.actions.refresh')}
            </button>
          </div>
        </Alert>
      )}
    </div>
  )
}
