/*
 *   Copyright (c) 2021 Kiyozz
 *   All rights reserved.
 */

import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import cx from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDidMount } from 'rooks'

import { Script } from '../../../common/interfaces/script'
import { shorten } from '../../../common/shorten'
import { TelemetryEvents } from '../../../common/telemetry-events'
import bridge from '../../bridge'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useIpc } from '../../hooks/use-ipc'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { scriptsToInterface } from '../../utils/scripts/scripts-to-interface'
import uniqScripts from '../../utils/scripts/uniq-scripts'
import { Dialog } from './dialog'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectFile: (files: Script[]) => void
}

export function DialogRecentFiles({ isOpen, onClose }: Props): JSX.Element {
  const { t } = useTranslation()
  const { send } = useTelemetry()
  const { setScripts, scripts: loadedScripts } = useCompilation()
  const { config } = useApp()
  const { clearRecentFiles, removeRecentFile, recentFiles } = useRecentFiles()
  const [selectedRecentFiles, setSelectedRecentFiles] = useState(
    new Map<string, Script>(),
  )
  const [isFirstRender, setFirstRender] = useState(true)

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

  useIpc(bridge.recentFiles.select.onRevertSelection, () => {
    send(TelemetryEvents.recentFilesRevertSelection, {})

    // TODO: get selected items and not loaded (full list)
    // and get diff
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
    clearRecentFiles()
    setSelectedRecentFiles(new Map())
  })

  const onClickClose = () => {
    setSelectedRecentFiles(new Map())
    onClose()
  }

  const onClickLoad = () => {
    send(TelemetryEvents.recentFilesLoaded, {})
    setScripts(scripts =>
      uniqScripts(
        scriptsToInterface(scripts, Array.from(selectedRecentFiles.values())),
      ),
    )
    setSelectedRecentFiles(new Map())
    onClose()
  }

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
            console.log('delete', script, srf)

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

  const LineActions = useCallback(
    ({
      onClickFile,
      onClickDelete,
      disabled = false,
      selected,
    }: {
      onClickFile: (evt: React.MouseEvent<HTMLButtonElement>) => void
      onClickDelete: (evt: React.MouseEvent<HTMLButtonElement>) => void
      selected: boolean
      disabled?: boolean
    }) => {
      return (
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
        </div>
      )
    },
    [],
  )

  const processedList = useMemo(() => {
    return recentFiles.map(script => {
      const shortenedPath = shorten(script.path, {
        length: 20,
        home: true,
        homedir: config.game.path,
      })

      return (
        <div
          className="w-full grid grid-recent-files items-center gap-4"
          key={script.path}
        >
          <LineActions
            onClickFile={onClickFile(script)}
            onClickDelete={onClickDeleteFile(script)}
            disabled={isAlreadyLoaded(script)}
            selected={selectedRecentFiles.has(script.path)}
          />
          <div className="text-xs text-gray-500 tracking-tight">
            {shortenedPath.path}
            <span className="text-black-800 dark:text-white font-bold">
              {shortenedPath.filename}
            </span>
          </div>
        </div>
      )
    })
  }, [
    LineActions,
    config.game.path,
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
      onClose={onClickClose}
      actions={
        <>
          <button className="btn" onClick={onClickClose}>
            {t('page.compilation.recentFilesDialog.close')}
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
          <div className="paper paper-darker">{processedList}</div>
        </div>
      )}
    </Dialog>
  )
}
