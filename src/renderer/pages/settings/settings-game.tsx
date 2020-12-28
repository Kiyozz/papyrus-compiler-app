/*
 * Copyright (c) 2020 Kiyozz.
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
import { Games, getExecutable } from '../../../common/game'
import { DialogTextField } from '../../components/dialog-text-field'
import { usePageContext } from '../../components/page-context'
import { Alert } from '../../components/alert'
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
  onClickRefreshInstallation
}: Props) {
  const { t } = useTranslation()
  const {
    config: { gameType, gamePath, compilerPath }
  } = usePageContext()
  const { isInstallationBad } = useSettings()
  const exe = getExecutable(gameType)

  return (
    <div className="paper">
      <h1 className="text-2xl text-white mb-3">{t('page.settings.game')}</h1>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup row value={gameType} onChange={onClickRadio}>
          <FormControlLabel
            value={Games.LE}
            classes={{
              label: 'text-white'
            }}
            control={<Radio />}
            label={Games.LE}
          />
          <FormControlLabel
            value={Games.SE}
            classes={{
              label: 'text-white'
            }}
            control={<Radio />}
            label={Games.SE}
          />
        </RadioGroup>
      </FormControl>

      <div className="mt-3">
        <DialogTextField
          id="game-folder"
          error={isInstallationBad === 'game'}
          label={t('page.settings.gameFolderInfo', { gameType, exe })}
          defaultValue={gamePath}
          onChange={onChangeGameFolder}
          type="folder"
        />
      </div>

      <div className="mt-3">
        <DialogTextField
          id="compiler-path"
          error={isInstallationBad === 'compiler'}
          label={t('page.settings.compilerPath')}
          defaultValue={compilerPath}
          onChange={onChangeCompilerPath}
          type="file"
        />
      </div>

      {isInstallationBad !== false && isInstallationBad !== 'mo2-instance' && (
        <Alert>
          <div className="w-full">
            <p className="select-text mb-2">
              {t('page.settings.errors.installationInvalid')}
            </p>

            <p className="select-text">
              {isInstallationBad === 'game' &&
                t('page.settings.errors.game', { exe })}
              {isInstallationBad === 'compiler' &&
                t('page.settings.errors.compiler', {
                  compilerExe: compilerPath
                })}
              {isInstallationBad === 'scripts' &&
                t('page.settings.errors.scripts')}
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
