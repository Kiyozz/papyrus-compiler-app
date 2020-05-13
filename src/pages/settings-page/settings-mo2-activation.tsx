import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import { useSettingsContext } from './settings-context'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SettingsMo2Activation: React.FC<Props> = ({ onChangeMo2 }) => {
  const { mo2 } = useSettingsContext()

  return (
    <Tooltip title="Only when the app is not started from MO2" placement="right" arrow>
      <FormControlLabel
        control={(
          <Checkbox
            id="mo2"
            name="mo2"
            checked={mo2}
            onChange={onChangeMo2}
          />
        )}
        label="Enable"
      />
    </Tooltip>
  )
}

export default SettingsMo2Activation
