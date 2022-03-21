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
  SnackbarProps,
} from '@mui/material'
import React, {
  useState,
  MouseEvent,
  ReactNode,
  PropsWithChildren,
} from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown, { Components } from 'react-markdown'

import { GITHUB_LINK } from '../../../common/constants'
import bridge from '../../bridge'
import { Env } from '../../env'
import { useApp } from '../../hooks/use-app'
import { useInitialization } from '../../hooks/use-initialization'
import Anchor from '../anchor'

const Img: Components['img'] = ({ src, alt, ...props }) => {
  const newSrc = src?.startsWith('docs')
    ? `${GITHUB_LINK}/blob/master/${src}?raw=true`
    : src

  return (
    <img
      src={newSrc}
      alt={alt}
      className="mt-2 max-w-full rounded"
      {...props}
    />
  )
}

const HeadingOne = ({ children }: PropsWithChildren<unknown>) => (
  <Typography variant="h3" component="h1" gutterBottom>
    {children}
  </Typography>
)

const HeadingTwo = ({ children }: PropsWithChildren<unknown>) => (
  <Typography variant="h4" component="h2" gutterBottom>
    {children}
  </Typography>
)

const HeadingThree = ({ children }: PropsWithChildren<unknown>) => (
  <Typography variant="h5" component="h3" gutterBottom className="mt-2">
    {children}
  </Typography>
)

const HeadingFive = ({ children }: PropsWithChildren<unknown>) => (
  <Typography variant="h6" component="h5" gutterBottom>
    {children}
  </Typography>
)

const Paragraph = ({ children }: PropsWithChildren<unknown>) => (
  <Typography>{children}</Typography>
)

const Code = ({ children }: { children: ReactNode[] }) => (
  <Typography component="code" className="markdown-code dark:bg-gray-800">
    {children}
  </Typography>
)

const UnorderedList = ({ children }: PropsWithChildren<unknown>) => {
  return <List disablePadding>{children}</List>
}

const HtmlListItem = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <ListItem disablePadding>
      <ListItemText primary={children} />
    </ListItem>
  )
}

const DialogChangelog = () => {
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

    bridge.shell.openExternal(Env.modUrl)
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
        open={isShowLatestVersionAlert}
        onClose={onCloseShowLatestVersionAlert}
        autoHideDuration={3_000}
      >
        <Alert severity="info">{t('changelog.alreadyLastVersion')}</Alert>
      </Snackbar>

      <Snackbar
        open={
          isShowChangelogs &&
          !isShowLatestVersionAlert &&
          !isShowChangelogsDialoag
        }
        autoHideDuration={8_000}
        onClose={onCloseNewVersionAlert}
      >
        <Alert
          severity="info"
          action={
            <Button onClick={onClickShowChangelogs} size="small">
              {t('changelog.available.notes')}
            </Button>
          }
        >
          <Typography>
            {t('changelog.available.message', { version: latestVersion })}
          </Typography>
        </Alert>
      </Snackbar>

      <Dialog
        open={isShowChangelogsDialoag}
        onClose={onCloseChangelogsDialog}
        fullScreen
        aria-labelledby="dialog-notes-title"
        aria-describedby="dialog-notes-content"
      >
        <DialogTitle id="dialog-notes-title">
          {t('changelog.changelogs')}
        </DialogTitle>
        <DialogContent id="dialog-notes-content" dividers>
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
