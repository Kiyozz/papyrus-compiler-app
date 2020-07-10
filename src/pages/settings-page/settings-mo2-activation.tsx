import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from './settings-context'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SettingsMo2Activation: React.FC<Props> = ({ onChangeMo2 }) => {
  const { t } = useTranslation()
  const { mo2 } = useSettings()

  return (
    <Tooltip title={t<string>('page.settings.mo2.enableText')} placement="right" arrow>
      <FormControlLabel
        control={(
          <Checkbox
            id="mo2"
            name="mo2"
            checked={mo2}
            onChange={onChangeMo2}
          />
        )}
        label={t('page.settings.mo2.enable')}
      />
    </Tooltip>
  )
}

export default SettingsMo2Activation
