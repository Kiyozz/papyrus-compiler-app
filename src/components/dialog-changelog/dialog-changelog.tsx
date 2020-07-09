import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import DownloadIcon from '@material-ui/icons/GetApp'

import React from 'react'
import ReactMarkdown from 'react-markdown'

import useOnKeyUp from '../../hooks/use-on-key-up'
import { RootStore } from '../../redux/stores/root.store'
import { useStoreSelector } from '../../redux/use-store-selector'

const { shell } = window.require('electron')

interface StateProps {
  notes: string
  startingVersion: string
  latestNotesVersion: string
  showNotes: boolean
  releaseLink: string
}

interface Props {
  onClose: () => void
}

const DialogChangelog: React.FC<Props> = ({ onClose }) => {
  const { startingVersion, showNotes, latestNotesVersion, notes, releaseLink } = useStoreSelector<StateProps>(({ changelog }: RootStore) => ({
    latestNotesVersion: changelog.version,
    showNotes: changelog.showNotes,
    startingVersion: changelog.startingVersion,
    notes: changelog.notes,
    releaseLink: 'https://www.nexusmods.com/skyrim/mods/96339?tab=files'
  }))

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
          {startingVersion} <ArrowForwardIcon /> {latestNotesVersion}
        </DialogContentText>
        <ReactMarkdown source={notes} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button color="primary" variant="contained" startIcon={<DownloadIcon />} onClick={onClickDownloadRelease}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogChangelog
