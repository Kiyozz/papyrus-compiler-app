import Paper from '@material-ui/core/Paper'

import React from 'react'

import SettingsMo2Activation from './settings-mo2-activation'
import SettingsMo2Instance from './settings-mo2-instance'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeMo2Instance: (value: string) => void
  onClickUpdateDetectedSourcesFolders: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SettingsMo2: React.FC<Props> = ({ onChangeMo2, onChangeMo2Instance, onClickUpdateDetectedSourcesFolders }) => {
  return (
    <Paper>
      <h4>Mod Organizer 2</h4>

      <SettingsMo2Activation onChangeMo2={onChangeMo2} />

      <SettingsMo2Instance
        onChangeMo2Instance={onChangeMo2Instance}
        onClickUpdateDetectedSourcesFolders={onClickUpdateDetectedSourcesFolders}
      />
    </Paper>
  )
}

export default SettingsMo2
