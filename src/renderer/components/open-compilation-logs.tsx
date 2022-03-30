/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
} from '@mui/material'
import cx from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../../common/telemetry-event'
import { useApp } from '../hooks/use-app'
import { useCompilation } from '../hooks/use-compilation'
import { useTelemetry } from '../hooks/use-telemetry'
import { isFailedScript, isSuccessScript } from '../utils/scripts/status'
import DrawerButton from './drawer-button'
import type { ScriptRenderer } from '../types'
import type { KeyboardEvent} from 'react';

function LogsListItem({
  script,
  logs,
}: {
  script: ScriptRenderer
  logs: string
}) {
  const { t } = useTranslation()
  const { copyToClipboard } = useApp()
  const { send } = useTelemetry()
  const onClickCopyLogs = () => {
    send(TelemetryEvent.compilationLogsCopy, {})
    copyToClipboard(`${script.name}\n\n${logs}\n`)
  }

  const isSuccess = isSuccessScript(script)
  const isFailed = isFailedScript(script)

  return (
    <Paper
      aria-describedby={`${script.id}-logs`}
      aria-labelledby={`${script.id}-title`}
      elevation={3}
    >
      <Paper
        className="sticky -top-1 rounded-bl-none rounded-br-none p-2 shadow-none"
        elevation={4}
      >
        <Typography
          aria-label={script.name}
          className="flex items-center justify-between"
          component="div"
          id={`${script.id}-title`}
        >
          <Typography
            className={cx('flex items-center gap-2 overflow-x-hidden')}
            variant="h6"
          >
            {isSuccess && <CheckCircleIcon className="text-green-500" />}
            {isFailed && <ErrorIcon className="text-red-300" />} {script.name}
          </Typography>
          <Button onClick={onClickCopyLogs}>{t('common.copy')}</Button>
        </Typography>
      </Paper>
      <Paper
        className="block w-full rounded-tr-none rounded-tl-none bg-gray-800 p-4 text-white dark:bg-black-800"
        component="code"
        elevation={0}
        id={`${script.id}-logs`}
        role="log"
      >
        {logs.split('\n').map((log, i) => (
          <span
            className="select-text break-words text-justify font-mono text-xs"
            key={i}
          >
            {log} <br />
          </span>
        ))}
      </Paper>
    </Paper>
  )
}

function OpenCompilationLogs() {
  const { t } = useTranslation()
  const { logs } = useCompilation()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const onClickButtonOpenLogs = () => {
    setDialogOpen(true)
  }

  const onClickButtonCloseLogs = () => {
    setDialogOpen(false)
  }

  const onDialogKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      setDialogOpen(false)
    }
  }

  const hasErrorsInLogs = logs.some(([log]) => isFailedScript(log))
  const isAllScriptsSuccessInLogs =
    logs.length > 0 && logs.every(([log]) => isSuccessScript(log))

  return (
    <>
      <DrawerButton
        icon={
          isAllScriptsSuccessInLogs ? (
            <CheckCircleIcon className="text-green-500" />
          ) : (
            <ErrorIcon
              className={cx(
                hasErrorsInLogs && !isAllScriptsSuccessInLogs && 'text-red-300',
              )}
            />
          )
        }
        onClick={onClickButtonOpenLogs}
        text={t('common.logs.nav')}
      />

      <Dialog
        aria-describedby="logs-content"
        aria-labelledby="logs-title"
        fullScreen
        onClose={onClickButtonCloseLogs}
        onKeyDown={onDialogKeyDown}
        open={isDialogOpen}
      >
        <DialogTitle className="-mb-1" id="logs-title">
          {t('common.logs.title')}
        </DialogTitle>
        <DialogContent
          className={cx(
            'flex flex-col gap-4',
            logs.length === 0 && 'items-center justify-center',
          )}
          dividers
          id="logs-content"
        >
          {logs.length > 0 ? (
            logs.map(([script, scriptLogs]) => (
              <LogsListItem key={script.id} logs={scriptLogs} script={script} />
            ))
          ) : (
            <Typography component="span" variant="h5">
              {t('common.logs.noLogs')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickButtonCloseLogs}>
            {t('common.logs.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OpenCompilationLogs
