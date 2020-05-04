import Dialog from '@material-ui/core/Dialog'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import DownloadIcon from '@material-ui/icons/GetApp'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import useOnKeyUp from '../../hooks/use-on-key-up'
import styled from '@emotion/styled'

const { shell } = window.require('electron')

export interface StateProps {
  notes: string
  startingVersion: string
  latestNotesVersion: string
  showNotes: boolean
  releaseLink: string
}

export interface OwnProps {
  onClose: () => void
}

type Props = StateProps & OwnProps

const Content = styled.div`
  padding: 0 30px;
`

const AppChangelog: React.FC<Props> = ({ onClose, notes, releaseLink, latestNotesVersion, startingVersion, showNotes }) => {
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

export default AppChangelog
