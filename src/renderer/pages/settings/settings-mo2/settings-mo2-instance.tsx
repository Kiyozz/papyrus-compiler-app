/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import RefreshIcon from '@mui/icons-material/Refresh'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '../../../components/alert'
import DialogTextField from '../../../components/dialog/dialog-text-field'
import { useApp } from '../../../hooks/use-app'
import { useSettings } from '../use-settings'

interface Props {
  onChangeMo2Instance: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function SettingsMo2Instance({
  onChangeMo2Instance,
  onClickRefreshInstallation,
}: Props) {
  const { t } = useTranslation()
  const {
    config: { mo2 },
  } = useApp()
  const { configError } = useSettings()

  if (!mo2.use) {
    return null
  }

  return (
    <>
      <DialogTextField
        defaultValue={mo2.instance ?? ''}
        error={configError === 'mo2-instance'}
        id="mo2-instance"
        label={t('page.settings.mo2.instance')}
        onChange={onChangeMo2Instance}
        type="folder"
      />

      {configError === 'mo2-instance' && (
        <Alert>
          <div className="w-full">
            <p className="mb-2 select-text">
              {t('page.settings.errors.installationInvalid')}
            </p>

            <p className="select-text">
              {t('page.settings.errors.mo2Instance', {
                mo2Instance: mo2.instance,
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
    </>
  )
}

export default SettingsMo2Instance
