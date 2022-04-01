/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import RefreshIcon from '@mui/icons-material/Refresh'
import { Button, Alert, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DialogTextField from '../../../components/dialog/dialog-text-field'
import { useApp } from '../../../hooks/use-app'
import { useSettings } from '../use-settings'

interface SettingsMo2InstanceProps {
  onChangeMo2Instance: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function SettingsMo2Instance({
  onChangeMo2Instance,
  onClickRefreshInstallation,
}: SettingsMo2InstanceProps) {
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
        className="mt-2"
        defaultValue={mo2.instance ?? ''}
        error={configError === 'mo2-instance'}
        id="mo2-instance"
        label={t('page.settings.mo2.instance')}
        onChange={onChangeMo2Instance}
        type="folder"
      />

      {(configError === 'mo2-instance' ||
        configError === 'mo2-instance-mods') && (
        <Alert className="mt-3" severity="error">
          <Typography className="select-text" gutterBottom>
            {t('page.settings.errors.installationInvalid')}
          </Typography>

          <Typography className="select-text" gutterBottom>
            {configError === 'mo2-instance'
              ? t('page.settings.errors.mo2Instance', {
                  mo2Instance: mo2.instance,
                })
              : t('page.settings.errors.mo2InstanceMods')}
          </Typography>
          <Button
            onClick={onClickRefreshInstallation}
            startIcon={<RefreshIcon />}
          >
            {t('common.refresh')}
          </Button>
        </Alert>
      )}
    </>
  )
}

export default SettingsMo2Instance
