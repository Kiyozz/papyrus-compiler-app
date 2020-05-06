import Typography from '@material-ui/core/Typography'

import React from 'react'

import classes from './settings-page.module.scss'

interface Props {
  version: string
}

const SettingsVersion: React.FC<Props> = ({ version }) => {
  return (
    <Typography variant="caption" className={classes.version}>
      Version {version}
    </Typography>
  )
}

export default SettingsVersion
