import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import React from 'react'

import SettingsMo2Activation from './settings-mo2-activation'
import SettingsMo2Instance from './settings-mo2-instance'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeMo2Instance: (value: string) => void
}

const SettingsMo2: React.FC<Props> = ({ onChangeMo2, onChangeMo2Instance }) => {
  return (
    <Paper>
      <Typography variant="h5" component="h1">
        Mod Organizer 2
      </Typography>

      <SettingsMo2Activation onChangeMo2={onChangeMo2} />
      <SettingsMo2Instance onChangeMo2Instance={onChangeMo2Instance} />
    </Paper>
  )
}

export default SettingsMo2
