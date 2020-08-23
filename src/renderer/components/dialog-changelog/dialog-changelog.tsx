import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import DownloadIcon from '@material-ui/icons/GetApp'

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'

import useOnKeyUp from '../../hooks/use-on-key-up'
import { useStoreSelector } from '../../redux/use-store-selector'

interface Props {
  onClose: () => void
}

const DialogChangelog: React.FC<Props> = ({ onClose }) => {
  const shell = useMemo(() => window.require('electron').shell, [])
  const releaseLink = useMemo(() => process.env.APP_NEXUS_PATH ?? 'https://www.nexusmods.com/skyrim/mods/96339?tab=files', [])
  const showNotes = useStoreSelector(store => store.changelog.showNotes)
  const notes = useStoreSelector(store => store.changelog.notes)
  const latestVersion = useStoreSelector(store => store.changelog.latestVersion)
  const version = useStoreSelector(store => store.changelog.version)

  const onClickDownloadRelease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    shell.openExternal(releaseLink)
  }

  useOnKeyUp('Escape', () => {
    onClose()
  })

  return (
    <Dialog open={showNotes} onClose={onClose}>
      <DialogTitle>A new version is available</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {version} <ArrowForwardIcon /> {latestVersion}
        </DialogContentText>
        <ReactMarkdown source={notes} />
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
