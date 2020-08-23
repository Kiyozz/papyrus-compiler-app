import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import DownloadIcon from '@material-ui/icons/GetApp'

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

import classes from '../open-compilation-logs/open-compilation-logs.module.scss'

import useOnKeyUp from '../../hooks/use-on-key-up'
import { useStoreSelector } from '../../redux/use-store-selector'

interface Props {
  onClose: () => void
}

const Heading: React.FC<{ level: number }> = ({ children, level }) => {
  return (
    <Typography gutterBottom={true} variant={level === 2 ? 'h5' : 'h6'}>
      {children}
    </Typography>
  )
}

const Paragraph: React.FC = ({ children }) => {
  return <Typography variant="body2">{children}</Typography>
}

const Code: React.FC<{ value: string }> = ({ value }) => {
  return (
    <code className={classes.logsContainer}>
      {value.split('\n').map((s, i) => (
        <pre key={i} className={classes.pre}>
          {s}
        </pre>
      ))}
    </code>
  )
}

const DialogChangelog: React.FC<Props> = ({ onClose }) => {
  const shell = useMemo(() => window.require('electron').shell, [])
  const { t } = useTranslation()
  const releaseLink = useMemo(() => process.env.APP_NEXUS_PATH ?? 'https://www.nexusmods.com/skyrim/mods/96339?tab=files', [])
  const showNotes = useStoreSelector(store => store.changelog.showNotes)
  const notes = useStoreSelector(store => store.changelog.notes)

  const onClickDownloadRelease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    shell.openExternal(releaseLink)
  }

  useOnKeyUp('Escape', () => {
    onClose()
  })

  return (
    <Dialog open={showNotes} fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>{t('changelog.newVersion')}</DialogTitle>
      <DialogContent>
        <ReactMarkdown
          source={notes}
          renderers={{
            paragraph: Paragraph,
            heading: Heading,
            code: Code
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button color="primary" variant="contained" startIcon={<DownloadIcon />} onClick={onClickDownloadRelease}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogChangelog
