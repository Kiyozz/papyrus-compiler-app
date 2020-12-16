/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../components/page/page-context'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SettingsMo2Activation({ onChangeMo2 }: Props) {
  const { t } = useTranslation()
  const {
    config: { mo2 }
  } = usePageContext()

  return (
    <Tooltip
      title={t<string>('page.settings.mo2.enableText')}
      placement="right"
      arrow
    >
      <FormControlLabel
        control={
          <Checkbox
            id="mo2"
            name="mo2"
            checked={mo2.use}
            onChange={onChangeMo2}
          />
        }
        label={t('page.settings.mo2.enable')}
      />
    </Tooltip>
  )
}