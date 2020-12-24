/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ErrorIcon from '@material-ui/icons/Error'

import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ScriptModel } from '../../models'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'

export function LogsListItem({
  script,
  logs
}: {
  script: ScriptModel
  logs: string
}) {
  return (
    <div>
      <h3 className="select-all">{script.name}</h3>
      <code className="p-4 bg-gray-700 mt-2 block w-full rounded">
        {logs.split('\n').map((log, i) => (
          <span className="font-mono break-words" key={i}>
            {log} <br />
          </span>
        ))}
      </code>
    </div>
  )
}

export function OpenCompilationLogs() {
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
      <li
        onClick={onClickButtonOpenLogs}
        className="w-full px-4 py-2 flex hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <ErrorIcon className="mr-6" />
        <div>{t('common.logs.nav')}</div>
      </li>

      <Dialog
        open={popupOpen}
        onClose={onClickButtonCloseLogs}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle className="select-none">
          {t('common.logs.title')}
        </DialogTitle>
        <DialogContent>
          {logs.length > 0 ? (
            logs.map(([script, scriptLogs], index) => (
              <LogsListItem key={index} script={script} logs={scriptLogs} />
            ))
          ) : (
            <span className="select-none">{t('common.logs.noLogs')}</span>
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
