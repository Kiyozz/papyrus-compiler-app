/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'

import { usePageContext } from '../../components/page-context'
import { SettingsMo2Activation } from './settings-mo2-activation'
import { SettingsMo2Instance } from './settings-mo2-instance'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeMo2Instance: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function SettingsMo2({
  onChangeMo2,
  onChangeMo2Instance,
  onClickRefreshInstallation
}: Props) {
  const { t } = useTranslation()
  const {
    config: { mo2 }
  } = usePageContext()

  return (
    <div className="paper mt-4 relative" id="settings-mo2">
      <h1 className="text-2xl text-white mb-3 flex items-center flex-wrap">
        <span className="inline-block mr-2">Mod Organizer 2</span>
        {!mo2.use && (
          <span className="text-xs text-gray-400">
            ({t('page.settings.mo2.enableText')})
          </span>
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
