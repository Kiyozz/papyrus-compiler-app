/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import ErrorIcon from '@material-ui/icons/Error'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../common/telemetry-events'
import { useApp } from '../hooks/use-app'
import { useCompilation } from '../hooks/use-compilation'
import { useDrawer } from '../hooks/use-drawer'
import { useTelemetry } from '../hooks/use-telemetry'
import { ScriptInterface } from '../interfaces'
import { Dialog } from './dialog/dialog'
import { NavItem } from './nav-item'

export function LogsListItem({
  script,
  logs,
}: {
  script: ScriptInterface
  logs: string
}): JSX.Element {
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

export function OpenCompilationLogs(): JSX.Element {
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

  return (
    <>
      <NavItem onClick={onClickButtonOpenLogs} className="link">
        <ErrorIcon />
        {isDrawerExpand && <div className="ml-6">{t('common.logs.nav')}</div>}
      </NavItem>

      <Dialog
        open={isDialogOpen}
        onClose={onClickButtonCloseLogs}
        maxWidth={80}
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
