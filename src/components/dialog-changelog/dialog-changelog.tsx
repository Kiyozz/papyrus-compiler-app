import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DownloadIcon from '@material-ui/icons/GetApp'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Button from '@material-ui/core/Button'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { connect } from 'react-redux'

import useOnKeyUp from '../../hooks/use-on-key-up'
import { RootStore } from '../../redux/stores/root.store'

const { shell } = window.require('electron')

interface StateProps {
  notes: string
  startingVersion: string
  latestNotesVersion: string
  showNotes: boolean
  releaseLink: string
}

interface OwnProps {
  onClose: () => void
}

type Props = StateProps & OwnProps

const Component: React.FC<Props> = ({ onClose, notes, releaseLink, latestNotesVersion, startingVersion, showNotes }) => {
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

const DialogChangelog = connect(({ changelog }: RootStore, { onClose }: OwnProps): StateProps & OwnProps => ({
  onClose,
  latestNotesVersion: changelog.version,
  showNotes: changelog.showNotes,
  startingVersion: changelog.startingVersion,
  notes: changelog.notes,
  releaseLink: 'https://www.nexusmods.com/skyrim/mods/96339?tab=files'
}))(Component)

export default DialogChangelog
