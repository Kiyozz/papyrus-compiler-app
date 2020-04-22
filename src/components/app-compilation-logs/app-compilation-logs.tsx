import Box from '@material-ui/core/Box'
import { makeStyles, Theme, styled } from '@material-ui/core/styles'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import Button from '@material-ui/core/Button'
import Backdrop from '@material-ui/core/Backdrop'
import ErrorIcon from '@material-ui/icons/Error'
import React, { useCallback, useMemo } from 'react'
import AppPaper from '../app-paper/app-paper'
import AppTitle from '../app-title/app-title'
import { CompilationLogsModel, ScriptModel } from '../../models'
import './app-compilation-logs.scss'

export interface StateProps {
  logs: CompilationLogsModel
  popupOpen: boolean
}

export interface OwnProps {
  open: boolean
}

export interface DispatchesProps {
  popupToggle: (toggle: boolean) => void
}

export type Props = StateProps & DispatchesProps & OwnProps

const useStyles = makeStyles((theme: Theme) => ({
  popup: {
    zIndex: theme.zIndex.drawer + 1,
    '& > p': {
      fontSize: '0.9rem'
    },
    '& > h2': {
      fontSize: '1.5rem'
    },
    pointerEvents: 'all'
  },
  popupPaper: {
    width: '50%'
  }
}))

const ScriptLogsSection = styled('div')({
  '*': {
    userSelect: 'none'
  }
})

const ScriptName = styled('h2')({
  fontSize: '1.5rem'
})

const ScriptLogs = styled('p')({
  fontSize: '0.8rem'
})

const ScriptLogsLine = styled('span')({})

const LogsListItem: React.FC<{ script: ScriptModel, logs: string }> = ({ script, logs }) => (
  <ScriptLogsSection>
    <ScriptName>{script.name}</ScriptName>
    <ScriptLogs>
      {logs.split('\n').map((log, i) => (
        <ScriptLogsLine key={i}>{log} <br /></ScriptLogsLine>
      ))}
    </ScriptLogs>
  </ScriptLogsSection>
)

const AppCompilationLogs: React.FC<Props> = ({ logs, popupOpen, popupToggle, open }) => {
  const classes = useStyles()

  const onClickButtonOpenLogs = useCallback(() => {
    popupToggle(true)
  }, [popupToggle])
  const onClickButtonCloseLogs = useCallback(() => {
    popupToggle(false)
  }, [popupToggle])

  const LogsList = useMemo(() => {
    return logs.map(([script, scriptLogs], index) => {
      return (
        <LogsListItem script={script} logs={scriptLogs} />
      )
    })
  }, [logs])

  return (
    <Box>
      <SpeedDialAction
        className="app-compilation-logs-button-activate"
        onClick={onClickButtonOpenLogs}
        icon={<ErrorIcon />}
        open={open && logs.length > 0}
        title="Open scripts logs"
        tooltipOpen
        tooltipTitle="Compilation logs"
      />

      <Backdrop className={classes.popup} open={popupOpen} onClick={onClickButtonCloseLogs}>
        <AppPaper className={classes.popupPaper}>
          <AppTitle className="app-compilation-logs-title">Logs</AppTitle>

          {LogsList}

          <Button
            className="app-compilation-logs-button-activate"
            onClick={onClickButtonCloseLogs}
          >
            Close
          </Button>
        </AppPaper>
      </Backdrop>
    </Box>
  )
}

export default AppCompilationLogs
