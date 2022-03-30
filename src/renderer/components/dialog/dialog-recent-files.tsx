/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material'
import cx from 'classnames'
import React, { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDidUpdate } from 'rooks'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { bridge } from '../../bridge'
import { useCompilation } from '../../hooks/use-compilation'
import { useIpc } from '../../hooks/use-ipc'
import { usePlatform } from '../../hooks/use-platform'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { dirname } from '../../utils/dirname'
import { scriptsToRenderer } from '../../utils/scripts/scripts-to-renderer'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import type { Script } from '../../../common/types/script'
import type { KeyboardEvent, MouseEvent } from 'react'

interface DialogRecentFilesProps {
  isOpen: boolean
  onClose: () => void
  onSelectFile: (files: Script[]) => void
}

function DialogRecentFiles({ isOpen, onClose }: DialogRecentFilesProps) {
  const { t } = useTranslation()
  const { send } = useTelemetry()
  const { setScripts, scripts: loadedScripts } = useCompilation()
  const platform = usePlatform()
  const {
    clearRecentFiles,
    removeRecentFile,
    recentFiles,
    moreDetails: [isMoreDetails, setMoreDetails],
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
    void clearRecentFiles()
    setSelectedRecentFiles(new Map())
  })

  const onClickClose = () => {
    setSelectedRecentFiles(new Map())
    onClose()
  }

  const onClickLoad = () => {
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

  const onDialogClose = () => {
    onClickClose()
  }

  const onDialogKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && isValid) {
      send(TelemetryEvent.recentFilesCloseWithEnter, {})
      // noinspection JSIgnoredPromiseFromCall
      onClickLoad()
    }
  }

  const onClickItem = (script: Script) => {
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
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.blur()

      await removeRecentFile(script)

      send(TelemetryEvent.recentFileRemove, {})
      setSelectedRecentFiles(srf => {
        srf.delete(script.path)

        return new Map(srf)
      })
    }
  }

  const isAlreadyLoaded = (script: Script) => {
    return Boolean(loadedScripts.find(s => s.path === script.path))
  }

  function Item({
    onClickFile,
    onClickDelete,
    disabled = false,
    selected,
    script,
  }: {
    onClickFile: (evt: MouseEvent<HTMLButtonElement>) => void
    onClickDelete: (evt: MouseEvent<HTMLButtonElement>) => void
    selected: boolean
    disabled?: boolean
    script: Script
  }) {
    const scriptInfo = {
      path: `${dirname(script.path)}${platform === 'windows' ? '\\' : '/'}`,
      filename: script.name,
    }

    return (
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton color="error" onClick={onClickDelete} tabIndex={2}>
            <DeleteOutlinedIcon />
          </IconButton>
        }
      >
        <ListItemButton
          classes={{ root: 'py-0' }}
          component="button"
          disableRipple
          disabled={disabled}
          onClick={onClickFile}
          role="checkbox"
          tabIndex={1}
        >
          <ListItemIcon>
            <Checkbox
              checked={selected}
              disableRipple
              edge="start"
              inputProps={{
                'aria-labelledby': script.name,
              }}
              tabIndex={-1}
            />
          </ListItemIcon>
          <ListItemText
            id={script.name}
            primary={scriptInfo.filename}
            secondary={isMoreDetails ? scriptInfo.path : undefined}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <Dialog
      aria-describedby="recent-files-content"
      aria-labelledby="recent-files-title"
      fullScreen
      onClose={onDialogClose}
      onKeyDown={onDialogKeyDown}
      open={isOpen}
    >
      <Toolbar className="p-0">
        <DialogTitle className="grow" id="recent-files-title">
          {t('page.compilation.actions.recentFiles')}
        </DialogTitle>
        <FormGroup id="recent-files-content">
          <FormControlLabel
            control={
              <Checkbox
                checked={isMoreDetails}
                onChange={() => setMoreDetails(v => !v)}
              />
            }
            label={t<string>('common.moreDetails')}
          />
        </FormGroup>
      </Toolbar>
      <DialogContent className={cx(recentFiles.length !== 0 && 'p-0')} dividers>
        {recentFiles.length === 0 ? (
          <DialogContentText>
            {t('page.compilation.recentFilesDialog.noRecentFiles')}
          </DialogContentText>
        ) : (
          <List className="overflow-x-hidden">
            {recentFiles.map(script => {
              return (
                <Item
                  disabled={isAlreadyLoaded(script)}
                  key={script.path}
                  onClickDelete={onClickDeleteFile(script)}
                  onClickFile={onClickItem(script)}
                  script={script}
                  selected={selectedRecentFiles.has(script.path)}
                />
              )
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickClose} tabIndex={4}>
          {t('common.cancel')}
        </Button>
        <Button
          disabled={selectedRecentFiles.size === 0}
          onClick={onClickLoad}
          tabIndex={3}
        >
          {t('page.compilation.recentFilesDialog.load')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(DialogRecentFiles)
