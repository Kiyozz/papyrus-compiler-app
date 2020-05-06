import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import React from 'react'
import { useSettingsContext } from './settings-context'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SettingsMo2Activation: React.FC<Props> = ({ onChangeMo2 }) => {
  const { mo2 } = useSettingsContext()

  return (
    <FormControlLabel
      control={(
        <Checkbox
          id="mo2"
          name="mo2"
          checked={mo2}
          onChange={onChangeMo2}
        />
      )}
      label="Using Mod Organizer 2"
    />
  )
}

export default SettingsMo2Activation
