import Typography from '@material-ui/core/Typography'

import React from 'react'
import { Trans } from 'react-i18next'

import classes from './settings-page.module.scss'

interface Props {
  version: string
}

const SettingsVersion: React.FC<Props> = ({ version }) => {
  return (
    <Typography variant="caption" className={classes.version}>
      <Trans i18nKey="page.settings.version">{{ version }}</Trans>
    </Typography>
  )
}

export default SettingsVersion
