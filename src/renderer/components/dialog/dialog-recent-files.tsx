/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import cx from 'classnames'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDidUpdate } from 'rooks'

import { shorten } from '../../../common/shorten'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { Script } from '../../../common/types/script'
import { useApp } from '../../hooks/use-app'
import { useBridge } from '../../hooks/use-bridge'
import { useCompilation } from '../../hooks/use-compilation'
import { useIpc } from '../../hooks/use-ipc'
import { usePlatform } from '../../hooks/use-platform'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { dirname } from '../../utils/dirname'
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
  const bridge = useBridge()
  const { t } = useTranslation()
  const { send } = useTelemetry()
  const { setScripts, scripts: loadedScripts } = useCompilation()
  const { config } = useApp()
  const platform = usePlatform()
  const {
    clearRecentFiles,
    removeRecentFile,
    recentFiles,
    showFullPath: [isShowFullPath, setShowFullPath],
  } = useRecentFiles()
  const [selectedRecentFiles, setSelectedRecentFiles] = useState(
    new Map<string, Script>(),
  )
  const isValid = selectedRecentFiles.size > 0

  useDidUpdate(() => {
    if (isOpen) {
      bridge.recentFiles.dialog.open()
    } else {
      bridge.recentFiles.dialog.close()
    }
  }, [isOpen])

  const notLoadedRecentFiles = useMemo(() => {
    return recentFiles.filter(rf => {
      return !loadedScripts.find(ls => ls.path === rf.path)
    })
  }, [recentFiles, loadedScripts])

  useIpc(bridge.recentFiles.select.onAll, () => {
    send(TelemetryEvent.recentFilesSelectAll, {})
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
    send(TelemetryEvent.recentFilesSelectNone, {})
    setSelectedRecentFiles(new Map())
  })

  useIpc(bridge.recentFiles.select.onInvertSelection, () => {
    send(TelemetryEvent.recentFilesInvertSelection, {})

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
    send(TelemetryEvent.recentFilesClear, {})
    // noinspection JSIgnoredPromiseFromCall
    clearRecentFiles()
    setSelectedRecentFiles(new Map())
  })

  const onClickClose = () => {
    setSelectedRecentFiles(new Map())
    onClose()
  }

  const onClickLoad = async () => {
    if (!isValid) {
      return
    }

    send(TelemetryEvent.recentFilesLoaded, {})
    setScripts(scripts =>
      uniqScripts(
        scriptsToRenderer(scripts, Array.from(selectedRecentFiles.values())),
      ),
    )
    setSelectedRecentFiles(new Map())
    onClose()
  }

  const onDialogClose = (reason: CloseReason) => {
    if (reason === CloseReason.enter && isValid) {
      send(TelemetryEvent.recentFilesCloseWithEnter, {})
      onClickLoad()
    } else {
      onClickClose()
    }
  }

  const onClickFile = (script: Script) => {
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
  }

  const onClickDeleteFile = (script: Script) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.blur()

      removeRecentFile(script).then(() => {
        send(TelemetryEvent.recentFileRemove, {})
        setSelectedRecentFiles(srf => {
          srf.delete(script.path)

          return new Map(srf)
        })
      })
    }
  }

  const isAlreadyLoaded = (script: Script) => {
    return !!loadedScripts.find(s => s.path === script.path)
  }

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
      const shortenedPath = isShowFullPath
        ? {
            path: `${dirname(script.path)}${
              platform === 'windows' ? '\\' : '/'
            }`,
            filename: script.name,
          }
        : shorten(script.path, {
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
            <div
              className={cx(
                'flex items-center text-xs tracking-tight text-gray-500',
                isShowFullPath ? 'h-6' : '',
              )}
            >
              <span className="whitespace-nowrap">{shortenedPath.path}</span>
              <button
                role="button"
                className={cx(
                  'cursor-pointer px-0 font-bold hover:text-primary-400 dark:hover:text-primary-400',
                  {
                    'text-primary-400 dark:text-primary-400':
                      selected && !disabled,
                    'text-black-800 dark:text-white': !selected && !disabled,
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
    [config.game?.path, isShowFullPath, platform],
  )

  return (
    <Dialog
      id="recent-files"
      open={isOpen}
      title={
        <>
          {t('page.compilation.actions.recentFiles')}

          <FormGroup classes={{ root: 'ml-4' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isShowFullPath}
                  onChange={() => setShowFullPath(v => !v)}
                />
              }
              label="Show full path"
            />
          </FormGroup>
        </>
      }
      onClose={onDialogClose}
      actions={
        <>
          <button className="btn" onClick={onClickClose}>
            {t('common.cancel')}
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
          <Paper darker className="overflow-x-hidden">
            {recentFiles.map(script => {
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
            })}
          </Paper>
        </div>
      )}
    </Dialog>
  )
}

export default memo(DialogRecentFiles)
