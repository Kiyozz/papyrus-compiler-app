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
import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  KeyboardEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDidUpdate } from 'rooks'

import { TelemetryEvent } from '../../../common/telemetry-event'
import { Script } from '../../../common/types/script'
import bridge from '../../bridge'
import { useCompilation } from '../../hooks/use-compilation'
import { useIpc } from '../../hooks/use-ipc'
import { usePlatform } from '../../hooks/use-platform'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { dirname } from '../../utils/dirname'
import { scriptsToRenderer } from '../../utils/scripts/scripts-to-renderer'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelectFile: (files: Script[]) => void
}

const DialogRecentFiles = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation()
  const { send } = useTelemetry()
  const { setScripts, scripts: loadedScripts } = useCompilation()
  const platform = usePlatform()
  const {
    clearRecentFiles,
    removeRecentFile,
    recentFiles,
    showPath: [isShowPath, setShowPath],
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

  const onDialogClose = () => {
    onClickClose()
  }

  const onDialogKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && isValid) {
      send(TelemetryEvent.recentFilesCloseWithEnter, {})
      onClickLoad()
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

  const Item = useCallback(
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
      const scriptInfo = {
        path: `${dirname(script.path)}${platform === 'windows' ? '\\' : '/'}`,
        filename: script.name,
      }

      return (
        <ListItem
          disablePadding
          secondaryAction={
            <IconButton color="error" onClick={onClickDelete}>
              <DeleteOutlinedIcon />
            </IconButton>
          }
        >
          <ListItemButton
            role="checkbox"
            component="button"
            onClick={onClickFile}
            disabled={disabled}
            classes={{ root: 'py-0' }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={selected}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  'aria-labelledby': script.name,
                }}
              />
            </ListItemIcon>
            <ListItemText
              id={script.name}
              secondary={isShowPath ? scriptInfo.path : undefined}
              primary={scriptInfo.filename}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItemButton>
        </ListItem>
      )
    },
    [isShowPath, platform],
  )

  return (
    <Dialog
      open={isOpen}
      onClose={onDialogClose}
      scroll="paper"
      fullWidth
      maxWidth="xl"
      onKeyDown={onDialogKeyDown}
      aria-labelledby="recent-files-title"
      aria-describedby="recent-files-content"
    >
      <Toolbar className="p-0">
        <DialogTitle className="grow" id="recent-files-title">
          {t('page.compilation.actions.recentFiles')}
        </DialogTitle>
        <FormGroup id="recent-files-content">
          <FormControlLabel
            control={
              <Checkbox
                checked={isShowPath}
                onChange={() => setShowPath(v => !v)}
              />
            }
            label={t<string>('page.compilation.recentFilesDialog.moreDetails')}
          />
        </FormGroup>
      </Toolbar>
      <DialogContent
        dividers
        className={cx('overflow-overlay', recentFiles.length !== 0 && 'p-0')}
      >
        {recentFiles.length === 0 ? (
          <DialogContentText>
            {t('page.compilation.recentFilesDialog.noRecentFiles')}
          </DialogContentText>
        ) : (
          <List className="overflow-x-hidden">
            {recentFiles.map(script => {
              return (
                <Item
                  key={script.path}
                  onClickFile={onClickFile(script)}
                  onClickDelete={onClickDeleteFile(script)}
                  disabled={isAlreadyLoaded(script)}
                  selected={selectedRecentFiles.has(script.path)}
                  script={script}
                />
              )
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickClose}>{t('common.cancel')}</Button>
        <Button onClick={onClickLoad} disabled={selectedRecentFiles.size === 0}>
          {t('page.compilation.recentFilesDialog.load')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(DialogRecentFiles)
