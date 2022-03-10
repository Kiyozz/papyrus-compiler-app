/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import ErrorIcon from '@mui/icons-material/Error'
import cx from 'classnames'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../common/telemetry-events'
import { ScriptStatus } from '../enums/script-status.enum'
import { useApp } from '../hooks/use-app'
import { useCompilation } from '../hooks/use-compilation'
import { useDrawer } from '../hooks/use-drawer'
import { useTelemetry } from '../hooks/use-telemetry'
import { ScriptRenderer } from '../types'
import Fade from './animations/fade'
import Dialog from './dialog/dialog'
import NavItem from './nav-item'

const LogsListItem = ({
  script,
  logs,
}: {
  script: ScriptRenderer
  logs: string
}) => {
  const { copyToClipboard } = useApp()
  const { send } = useTelemetry()
  const onClickCopyLogs = () => {
    send(TelemetryEvents.compilationLogsCopy, {})
    copyToClipboard(`${script.name}\n\n${logs}\n`)
  }

  return (
    <div>
      <div className="flex items-center justify-between bg-light-300 dark:bg-black-400 gap-4 pb-2 sticky top-0">
        <h3 className="select-all">{script.name}</h3>
        <button className="btn" onClick={onClickCopyLogs}>
          Copy
        </button>
      </div>
      <code className="p-4 paper-darker block w-full rounded">
        {logs.split('\n').map((log, i) => (
          <span className="font-mono text-xs break-words select-text" key={i}>
            {log} <br />
          </span>
        ))}
      </code>
    </div>
  )
}

const OpenCompilationLogs = () => {
  const { t } = useTranslation()
  const [isDrawerExpand] = useDrawer()
  const { logs } = useCompilation()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const onClickButtonOpenLogs = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const onClickButtonCloseLogs = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const hasErrorsInLogs = logs.some(
    ([log]) => log.status === ScriptStatus.failed,
  )
  const isAllScriptsSuccessInLogs =
    logs.length > 0 &&
    logs.every(([log]) => log.status === ScriptStatus.success)

  return (
    <>
      <NavItem onClick={onClickButtonOpenLogs} className="link">
        <ErrorIcon
          className={cx(
            isAllScriptsSuccessInLogs && 'text-green-500',
            hasErrorsInLogs && !isAllScriptsSuccessInLogs && 'text-red-300',
          )}
        />
        <Fade in={isDrawerExpand}>
          <div className="ml-6">{t('common.logs.nav')}</div>
        </Fade>
      </NavItem>

      <Dialog
        open={isDialogOpen}
        onClose={onClickButtonCloseLogs}
        actions={
          <button className="btn" onClick={onClickButtonCloseLogs}>
            {t('common.logs.close')}
          </button>
        }
        title={<h1 className="select-none">{t('common.logs.title')}</h1>}
      >
        <div className="flex flex-col gap-4">
          {logs.length > 0 ? (
            logs.map(([script, scriptLogs], index) => (
              <LogsListItem key={index} script={script} logs={scriptLogs} />
            ))
          ) : (
            <span className="select-none">{t('common.logs.noLogs')}</span>
          )}
        </div>
      </Dialog>
    </>
  )
}

export default OpenCompilationLogs
