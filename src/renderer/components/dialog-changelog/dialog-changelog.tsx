/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography
} from '@material-ui/core'
import DownloadIcon from '@material-ui/icons/GetApp'
import CloseIcon from '@material-ui/icons/Close'

import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

import useOnKeyUp from '../../hooks/use-on-key-up'
import { useStoreSelector } from '../../redux/use-store-selector'
import { MOD_URL } from '../../../common/mod'

interface Props {
  onClose: () => void
}

function Heading({
  children,
  level
}: React.PropsWithChildren<{ level: number }>) {
  return (
    <Typography gutterBottom={true} variant={level === 2 ? 'h5' : 'h6'}>
      {children}
    </Typography>
  )
}

function Paragraph({ children }: React.PropsWithChildren<unknown>) {
  return <Typography variant="body2">{children}</Typography>
}

function Code({ value }: { value: string }) {
  return (
    <code className="p-4 bg-gray-700 mt-2 block w-full rounded">
      {value.split('\n').map((s, i) => (
        <pre key={i} className="mb-0">
          {s}
        </pre>
      ))}
    </code>
  )
}

export function DialogChangelog({ onClose }: Props) {
  const shell = useMemo(() => window.require('electron').shell, [])
  const { t } = useTranslation()
  const showNotes = useStoreSelector(store => store.changelog.showNotes)
  const notes = useStoreSelector(store => store.changelog.notes)
  const latestVersion = useStoreSelector(store => store.changelog.latestVersion)

  const [isUserShowNotes, setUserShowNotes] = useState(false)

  const onClickDownloadRelease = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      shell.openExternal(MOD_URL)
    },
    [shell]
  )

  const onClickShowNotes = useCallback(() => {
    if (showNotes) {
      setUserShowNotes(true)
    }
  }, [showNotes])

  const onCloseDialog = useCallback(() => {
    setUserShowNotes(false)
    onClose()
  }, [onClose])

  useOnKeyUp('Escape', () => {
    onClose()
  })

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={showNotes && !isUserShowNotes}
        autoHideDuration={10000}
        message={t('changelog.available.message', { version: latestVersion })}
        action={
          <>
            <Button color="primary" size="small" onClick={onClickShowNotes}>
              {t('changelog.available.view')}
            </Button>
            <IconButton
              onClick={onCloseDialog}
              aria-label="close"
              color="inherit"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />

      <Dialog
        open={isUserShowNotes}
        fullWidth
        maxWidth="sm"
        onClose={onCloseDialog}
      >
        <DialogTitle>{t('changelog.newVersion')}</DialogTitle>
        <DialogContent>
          <ReactMarkdown
            source={notes}
            renderers={{
              paragraph: Paragraph,
              heading: Heading,
              code: Code
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Close</Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onClickDownloadRelease}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
