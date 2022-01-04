/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import cx from 'classnames'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDidMount } from 'rooks'

import { shorten } from '../../../common/shorten'
import { TelemetryEvents } from '../../../common/telemetry-events'
import { Script } from '../../../common/types/script'
import bridge from '../../bridge'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useIpc } from '../../hooks/use-ipc'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { scriptsToRenderer } from '../../utils/scripts/scripts-to-renderer'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import Paper from '../paper'
import Dialog, { CloseReason } from './dialog'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelectFile: (files: Script[]) => void
}

const DialogRecentFiles = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation()
  const { send } = useTelemetry()
  const { setScripts, scripts: loadedScripts } = useCompilation()
  const { config } = useApp()
  const { clearRecentFiles, removeRecentFile, recentFiles } = useRecentFiles()
  const [selectedRecentFiles, setSelectedRecentFiles] = useState(
    new Map<string, Script>(),
  )
  const [isFirstRender, setFirstRender] = useState(true)
  const isValid = useCallback(
    () => selectedRecentFiles.size > 0,
    [selectedRecentFiles.size],
  )

  useEffect(() => {
    if (!isFirstRender) {
      if (isOpen) {
        bridge.recentFiles.dialog.open()
      } else {
        bridge.recentFiles.dialog.close()
      }
    }
  }, [isOpen, isFirstRender])

  useDidMount(() => setFirstRender(false))

  const notLoadedRecentFiles = useMemo(() => {
    return recentFiles.filter(rf => {
      return !loadedScripts.find(ls => ls.path === rf.path)
    })
  }, [recentFiles, loadedScripts])

  useIpc(bridge.recentFiles.select.onAll, () => {
    send(TelemetryEvents.recentFilesSelectAll, {})
    setSelectedRecentFiles(
      new Map(
        notLoadedRecentFiles.map(notLoadedFile => [
          notLoadedFile.path,
          notLoadedFile,
        ]),
      ),
    )
  })

  useIpc(bridge.recentFiles.select.onNone, () => {
    send(TelemetryEvents.recentFilesSelectNone, {})
    setSelectedRecentFiles(new Map())
  })

  useIpc(bridge.recentFiles.select.onInvertSelection, () => {
    send(TelemetryEvents.recentFilesInvertSelection, {})

    setSelectedRecentFiles(selectedFiles => {
      return new Map(
        notLoadedRecentFiles
          .filter(s => {
            return !selectedFiles.has(s.path)
          })
          .map(s => [s.path, s]),
      )
    })
  })

  useIpc(bridge.recentFiles.select.onClear, () => {
    send(TelemetryEvents.recentFilesClear, {})
    // noinspection JSIgnoredPromiseFromCall
    clearRecentFiles()
    setSelectedRecentFiles(new Map())
  })

  const onClickClose = useCallback(() => {
    setSelectedRecentFiles(new Map())
    onClose()
  }, [onClose])

  const onClickLoad = useCallback(() => {
    if (!isValid()) {
      return
    }

    send(TelemetryEvents.recentFilesLoaded, {})
    setScripts(scripts =>
      uniqScripts(
        scriptsToRenderer(scripts, Array.from(selectedRecentFiles.values())),
      ),
    )
    setSelectedRecentFiles(new Map())
    onClose()
  }, [isValid, onClose, selectedRecentFiles, send, setScripts])

  const onDialogClose = useCallback(
    (reason: CloseReason) => {
      if (reason === CloseReason.enter && isValid()) {
        send(TelemetryEvents.recentFilesCloseWithEnter, {})
        onClickLoad()
      } else {
        onClickClose()
      }
    },
    [isValid, send, onClickLoad, onClickClose],
  )

  const onClickFile = useCallback(
    (script: Script) => {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur()

        if (selectedRecentFiles.has(script.path)) {
          setSelectedRecentFiles(list => {
            list.delete(script.path)

            return new Map(list)
          })
        } else {
          setSelectedRecentFiles(list => {
            list.set(script.path, script)

            return new Map(list)
          })
        }
      }
    },
    [selectedRecentFiles],
  )

  const onClickDeleteFile = useCallback(
    (script: Script) => {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur()

        removeRecentFile(script).then(() => {
          send(TelemetryEvents.recentFileRemove, {})
          setSelectedRecentFiles(srf => {
            srf.delete(script.path)

            return new Map(srf)
          })
        })
      }
    },
    [removeRecentFile, send],
  )

  const isAlreadyLoaded = useCallback(
    (script: Script) => {
      return !!loadedScripts.find(s => s.path === script.path)
    },
    [loadedScripts],
  )

  const Line = useCallback(
    ({
      onClickFile,
      onClickDelete,
      disabled = false,
      selected,
      script,
    }: {
      onClickFile: (evt: React.MouseEvent<HTMLButtonElement>) => void
      onClickDelete: (evt: React.MouseEvent<HTMLButtonElement>) => void
      selected: boolean
      disabled?: boolean
      script: Script
    }) => {
      const shortenedPath = shorten(script.path, {
        length: 20,
        home: true,
        homedir: config.game?.path ?? '',
      })

      return (
        <>
          <div className="flex gap-1">
            <button
              className="btn-icon btn-danger !p-0.5"
              onClick={onClickDelete}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </button>
            <button
              className={cx('btn-icon !p-0.5', selected && 'text-primary-400')}
              onClick={onClickFile}
              disabled={disabled}
            >
              {selected ? (
                <CheckBoxIcon fontSize="small" />
              ) : (
                <CheckBoxOutlineBlankIcon fontSize="small" />
              )}
            </button>
            <div className="text-xs text-gray-500 tracking-tight flex items-center">
              {shortenedPath.path}
              <button
                role="button"
                className={cx(
                  'px-0 font-bold hover:text-primary-400 dark:hover:text-primary-400 cursor-pointer',
                  {
                    'text-primary-400 dark:text-primary-400':
                      selected && !disabled,
                    'text-black-800 dark:text-white': !selected || !disabled,
                  },
                )}
                aria-disabled={disabled}
                onClick={onClickFile}
              >
                {shortenedPath.filename}
              </button>
            </div>
          </div>
        </>
      )
    },
    [config.game],
  )

  const processedList = useMemo(() => {
    return recentFiles.map(script => {
      return (
        <div key={script.path}>
          <Line
            onClickFile={onClickFile(script)}
            onClickDelete={onClickDeleteFile(script)}
            disabled={isAlreadyLoaded(script)}
            selected={selectedRecentFiles.has(script.path)}
            script={script}
          />
        </div>
      )
    })
  }, [
    Line,
    isAlreadyLoaded,
    onClickDeleteFile,
    onClickFile,
    recentFiles,
    selectedRecentFiles,
  ])

  return (
    <Dialog
      open={isOpen}
      title={t('page.compilation.actions.recentFiles')}
      onClose={onDialogClose}
      actions={
        <>
          <button className="btn" onClick={onClickClose}>
            {t('page.compilation.recentFilesDialog.cancel')}
          </button>
          <button
            className="btn"
            onClick={onClickLoad}
            disabled={selectedRecentFiles.size === 0}
          >
            {t('page.compilation.recentFilesDialog.load')}
          </button>
        </>
      }
    >
      {recentFiles.length === 0 ? (
        <span className="text-sm text-gray-500">
          {t('page.compilation.recentFilesDialog.noRecentFiles')}
        </span>
      ) : (
        <div className="flex flex-col gap-2">
          <Paper darker>{processedList}</Paper>
        </div>
      )}
    </Dialog>
  )
}

export default memo(DialogRecentFiles)
