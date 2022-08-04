/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DownloadIcon from '@mui/icons-material/GetApp'
import {
  Button,
  Snackbar,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { GITHUB_LINK } from '../../../common/constants'
import { bridge } from '../../bridge'
import { Env } from '../../env'
import { useApp } from '../../hooks/use-app'
import { useInitialization } from '../../hooks/use-initialization'
import Anchor from '../anchor'
import type {
  MouseEvent,
  ReactNode,
  PropsWithChildren,
  ImgHTMLAttributes,
} from 'react'
import type { SnackbarProps } from '@mui/material'

function Img({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const newSrc = src?.startsWith('docs')
    ? `${GITHUB_LINK}/blob/master/${src}?raw=true`
    : src

  return (
    <img
      alt={alt}
      className="mt-2 max-w-full rounded"
      src={newSrc}
      {...props}
    />
  )
}

function HeadingOne({ children }: PropsWithChildren) {
  return (
    <Typography component="h1" gutterBottom variant="h3">
      {children}
    </Typography>
  )
}

function HeadingTwo({ children }: PropsWithChildren) {
  return (
    <Typography component="h2" gutterBottom variant="h4">
      {children}
    </Typography>
  )
}

function HeadingThree({ children }: PropsWithChildren) {
  return (
    <Typography className="mt-2" component="h3" gutterBottom variant="h5">
      {children}
    </Typography>
  )
}

function HeadingFive({ children }: PropsWithChildren) {
  return (
    <Typography component="h5" gutterBottom variant="h6">
      {children}
    </Typography>
  )
}

function Paragraph({ children }: PropsWithChildren) {
  return <Typography>{children}</Typography>
}

function Code({ children }: { children: ReactNode[] }) {
  return (
    <Typography className="markdown-code dark:bg-gray-800" component="code">
      {children}
    </Typography>
  )
}

function UnorderedList({ children }: PropsWithChildren) {
  return <List disablePadding>{children}</List>
}

function HtmlListItem({ children }: PropsWithChildren) {
  return (
    <ListItem disablePadding>
      <ListItemText primary={children} />
    </ListItem>
  )
}

function DialogChangelog() {
  const { t } = useTranslation()
  const {
    showChangelogs: [isShowChangelogs, setShowChangelogs],
    changelogs: [changelogs],
    showLatestVersionAlert: [
      isShowLatestVersionAlert,
      setShowLastestVersionAlert,
    ],
  } = useApp()
  const { latestVersion } = useInitialization()

  const [isShowChangelogsDialoag, setShowChangelogsDialog] = useState(false)

  const onClickDownloadRelease = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()

    void bridge.shell.openExternal(Env.modUrl)
  }

  const onClickShowChangelogs = () => {
    setShowChangelogsDialog(true)
  }

  const onCloseChangelogsDialog = () => {
    setShowChangelogsDialog(false)
    setShowChangelogs(false)
  }

  const onCloseShowLatestVersionAlert: SnackbarProps['onClose'] = (
    evt,
    reason,
  ) => {
    if (reason !== 'timeout') return

    setShowLastestVersionAlert(false)
  }

  const onCloseNewVersionAlert: SnackbarProps['onClose'] = (evt, reason) => {
    if (reason !== 'timeout') return

    setShowChangelogs(false)
  }

  return (
    <>
      <Snackbar
        autoHideDuration={3_000}
        onClose={onCloseShowLatestVersionAlert}
        open={isShowLatestVersionAlert}
      >
        <Alert severity="info">{t('changelog.alreadyLastVersion')}</Alert>
      </Snackbar>

      <Snackbar
        autoHideDuration={8_000}
        onClose={onCloseNewVersionAlert}
        open={
          isShowChangelogs &&
          !isShowLatestVersionAlert &&
          !isShowChangelogsDialoag
        }
      >
        <Alert
          action={
            <Button onClick={onClickShowChangelogs} size="small">
              {t('changelog.available.notes')}
            </Button>
          }
          severity="info"
        >
          <Typography>
            {t('changelog.available.message', { version: latestVersion })}
          </Typography>
        </Alert>
      </Snackbar>

      <Dialog
        aria-describedby="dialog-notes-content"
        aria-labelledby="dialog-notes-title"
        fullScreen
        onClose={onCloseChangelogsDialog}
        open={isShowChangelogsDialoag}
      >
        <DialogTitle id="dialog-notes-title">
          {t('changelog.changelogs')}
        </DialogTitle>
        <DialogContent dividers id="dialog-notes-content">
          {changelogs && (
            <ReactMarkdown
              components={{
                p: Paragraph,
                h1: HeadingOne,
                h2: HeadingTwo,
                h3: HeadingThree,
                h5: HeadingFive,
                code: Code,
                a: Anchor,
                img: Img,
                ul: UnorderedList,
                li: HtmlListItem,
              }}
            >
              {changelogs}
            </ReactMarkdown>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseChangelogsDialog}>{t('common.close')}</Button>
          <Button onClick={onClickDownloadRelease} startIcon={<DownloadIcon />}>
            {t('common.download')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogChangelog
