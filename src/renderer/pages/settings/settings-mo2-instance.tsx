/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import RefreshIcon from '@material-ui/icons/Refresh'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Alert } from '../../components/alert'
import { DialogTextField } from '../../components/dialog/dialog-text-field'
import { useApp } from '../../hooks/use-app'
import { useSettings } from './settings-context'

interface Props {
  onChangeMo2Instance: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function SettingsMo2Instance({
  onChangeMo2Instance,
  onClickRefreshInstallation
}: Props): JSX.Element | null {
  const { t } = useTranslation()
  const {
    config: { mo2 }
  } = useApp()
  const { isBadInstallation } = useSettings()

  if (!mo2.use) {
    return null
  }

  return (
    <>
      <DialogTextField
        id="mo2-instance"
        error={isBadInstallation === 'mo2-instance'}
        defaultValue={mo2.instance ?? ''}
        label={t('page.settings.mo2.instance')}
        onChange={onChangeMo2Instance}
        type="folder"
      />

      {isBadInstallation === 'mo2-instance' && (
        <Alert>
          <div className="w-full">
            <p className="select-text mb-2">
              {t('page.settings.errors.installationInvalid')}
            </p>

            <p className="select-text">
              {t('page.settings.errors.mo2Instance', {
                mo2Instance: mo2.instance
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
    </>
  )
}
