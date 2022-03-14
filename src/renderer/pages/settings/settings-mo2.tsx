/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
import { Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useApp } from '../../hooks/use-app'
import SettingsMo2Activation from './settings-mo2-activation'
import SettingsMo2Instance from './settings-mo2-instance'

type Props = {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeMo2Instance: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SettingsMo2 = ({
  onChangeMo2,
  onChangeMo2Instance,
  onClickRefreshInstallation,
}: Props) => {
  const { t } = useTranslation()
  const {
    config: { mo2 },
  } = useApp()

  return (
    <div className="paper relative mt-4" id="settings-mo2">
      <h1 className="mb-3 flex flex-wrap items-center text-3xl dark:text-white">
        <span className="mr-2 inline-block">Mod Organizer 2</span>
        {!mo2.use && (
          <Tooltip title={t<string>('page.settings.mo2.enableText')}>
            <HelpIcon fontSize="small" />
          </Tooltip>
        )}
      </h1>

      <SettingsMo2Activation onChangeMo2={onChangeMo2} />
      <SettingsMo2Instance
        onChangeMo2Instance={onChangeMo2Instance}
        onClickRefreshInstallation={onClickRefreshInstallation}
      />
    </div>
  )
}

export default SettingsMo2
