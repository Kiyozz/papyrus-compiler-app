/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DownloadIcon from '@mui/icons-material/GetApp'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
} from '@mui/material'
import type { SnackbarProps } from '@mui/material'
import { type ComponentProps, type ReactNode, useState } from 'react'
import type { ImgHTMLAttributes, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { GITHUB_LINK } from '../../../common/constants'
import { bridge } from '../../bridge'
import { Env } from '../../env'
import { useApp } from '../../hooks/use-app'
import { useInitialization } from '../../hooks/use-initialization'
import Anchor from '../anchor'

function Img({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const newSrc = src?.startsWith('docs')
    ? `${GITHUB_LINK}/blob/master/${src}?raw=true`
    : src

  return (
    <img
      alt={alt}
      className="mt-2 max-w-full rounded-sm"
      src={newSrc}
      {...props}
    />
  )
}

function HeadingOne({ children }: ComponentProps<'h1'>) {
  return (
    <Typography component="h1" gutterBottom variant="h3">
      {/* ReactI18Next error */}
      {children as ReactNode}
    </Typography>
  )
}

function HeadingTwo({ children }: ComponentProps<'h2'>) {
  return (
    <Typography component="h2" gutterBottom variant="h4">
      {/* ReactI18Next error */}
      {children as ReactNode}
    </Typography>
  )
}

function HeadingThree({ children }: ComponentProps<'h3'>) {
  return (
    <Typography className="mt-2" component="h3" gutterBottom variant="h5">
      {children as ReactNode}
    </Typography>
  )
}

function HeadingFive({ children }: ComponentProps<'h5'>) {
  return (
    <Typography component="h5" gutterBottom variant="h6">
      {children as ReactNode}
    </Typography>
  )
}

function Paragraph({ children }: ComponentProps<'p'>) {
  return <Typography>{children as ReactNode}</Typography>
}

function Code({ children }: ComponentProps<'code'>) {
  return (
    <Typography className="markdown-code dark:bg-gray-800" component="code">
      {children as ReactNode}
    </Typography>
  )
}

function UnorderedList({ children }: ComponentProps<'ul'>) {
  return <List disablePadding>{children as ReactNode}</List>
}

function HtmlListItem({ children }: ComponentProps<'li'>) {
  return (
    <ListItem disablePadding>
      <ListItemText primary={children as ReactNode} />
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
    _evt,
    reason,
  ) => {
    if (reason !== 'timeout') return

    setShowLastestVersionAlert(false)
  }

  const onCloseNewVersionAlert: SnackbarProps['onClose'] = (_evt, reason) => {
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
