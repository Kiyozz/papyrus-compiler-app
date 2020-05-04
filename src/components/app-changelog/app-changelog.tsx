import styled from '@emotion/styled'
import Dialog from '@material-ui/core/Dialog'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
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

const Content = styled.div`
  padding: 0 30px;
`

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
      <Card>
        <CardHeader
          title="A new version is available"
          subheader={
            <div>{startingVersion} <ArrowForwardIcon /> {latestNotesVersion}</div>
          }
        />
        <Content>
          <CardContent>
            <ReactMarkdown source={notes} />
          </CardContent>
        </Content>
        <CardActions>
          <Button color="primary" variant="contained" startIcon={<DownloadIcon />} onClick={onClickDownloadRelease}>
            Download
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  )
}

const AppChangelog = connect(({ changelog }: RootStore, { onClose }: OwnProps): StateProps & OwnProps => ({
  onClose,
  latestNotesVersion: changelog.version,
  showNotes: changelog.showNotes,
  startingVersion: changelog.startingVersion,
  notes: changelog.notes,
  releaseLink: 'https://www.nexusmods.com/skyrim/mods/96339?tab=files'
}))(Component)

export default AppChangelog
