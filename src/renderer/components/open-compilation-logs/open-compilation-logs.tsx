import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ErrorIcon from '@material-ui/icons/Error'
import Typography from '@material-ui/core/Typography'

import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ScriptModel } from '../../models'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'

import classes from './open-compilation-logs.module.scss'

const LogsListItem: React.FC<{ script: ScriptModel; logs: string }> = ({ script, logs }) => (
  <div>
    <Typography className={classes.logTitle} variant="h6" component="h3">
      {script.name}
    </Typography>
    <code className={classes.logsContainer}>
      {logs.split('\n').map((log, i) => (
        <Typography className={classes.logItem} variant="caption" component="span" key={i}>
          {log} <br />
        </Typography>
      ))}
    </code>
  </div>
)

const OpenCompilationLogs: React.FC = () => {
  const { t } = useTranslation()
  const logs = useStoreSelector(state => state.compilationLogs.logs)
  const popupOpen = useStoreSelector(state => state.compilationLogs.popupOpen)
  const popupToggle = useAction(actions.compilationPage.logs.popupToggle)

  const onClickButtonOpenLogs = useCallback(() => {
    popupToggle(true)
  }, [popupToggle])

  const onClickButtonCloseLogs = useCallback(() => {
    popupToggle(false)
  }, [popupToggle])

  return (
    <>
      <ListItem button onClick={onClickButtonOpenLogs}>
        <ListItemIcon>
          <ErrorIcon />
        </ListItemIcon>
        <ListItemText primary={t('common.logs.nav')} />
      </ListItem>

      <Dialog open={popupOpen} onClose={onClickButtonCloseLogs} maxWidth="lg" fullWidth>
        <DialogTitle>{t('common.logs.title')}</DialogTitle>
        <DialogContent>
          {logs.length > 0
            ? logs.map(([script, scriptLogs], index) => <LogsListItem key={index} script={script} logs={scriptLogs} />)
            : t('common.logs.noLogs')}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickButtonCloseLogs}>{t('common.logs.close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OpenCompilationLogs
