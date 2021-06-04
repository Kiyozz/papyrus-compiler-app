/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import DownloadIcon from '@material-ui/icons/GetApp'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

import { MOD_URL } from '../../../common/mod'
import bridge from '../../bridge'
import { useApp } from '../../hooks/use-app'
import { useInitialization } from '../../hooks/use-initialization'
import { useOnKeyUp } from '../../hooks/use-on-key-up'
import { Toast } from '../toast'
import { Dialog } from './dialog'

function Anchor({
  children,
  href,
}: React.PropsWithChildren<React.HTMLProps<HTMLAnchorElement>>) {
  const onClick = () => {
    if (href) {
      bridge.shell.openExternal(href)
    }
  }

  return <a onClick={onClick}>{children}</a>
}

function HeadingTwo({ children }: React.PropsWithChildren<unknown>) {
  return <h6 className="mb-2 text-2xl">{children}</h6>
}

function HeadingFive({ children }: React.PropsWithChildren<unknown>) {
  return <h5 className="mb-2 text-xl">{children}</h5>
}

function HeadingThree({ children }: React.PropsWithChildren<unknown>) {
  return <h3 className="mb-2 text-xl">{children}</h3>
}

function Paragraph({ children }: React.PropsWithChildren<unknown>) {
  return <p className="text-sm">{children}</p>
}

function Code({ children }: { children: React.ReactNode[] }) {
  return <code className="dark:bg-gray-800 markdown-code">{children}</code>
}

export function DialogChangelog(): JSX.Element {
  const { t } = useTranslation()
  const {
    isShowChangelog,
    changelog,
    setShowChangelog,
    isCheckUsingLastVersion,
    setCheckUsingLastVersion,
  } = useApp()
  const { latestVersion } = useInitialization()

  const [isUserShowNotes, setUserShowNotes] = useState(false)

  const onClickDownloadRelease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    bridge.shell.openExternal(MOD_URL)
  }

  const onClickShowNotes = () => {
    if (isShowChangelog) {
      setUserShowNotes(true)
    }
  }

  const onCloseDialog = () => {
    setUserShowNotes(false)
    setShowChangelog(false)
    setCheckUsingLastVersion(false)
  }

  useOnKeyUp('Escape', () => {
    setShowChangelog(false)
  })

  return (
    <>
      <Toast
        message={t('changelog.available.message', { version: latestVersion })}
        actions={
          <button className="btn btn-text-primary" onClick={onClickShowNotes}>
            {t('changelog.available.view')}
          </button>
        }
        onClose={onCloseDialog}
        in={isShowChangelog && !isCheckUsingLastVersion && !isUserShowNotes}
        speedMs={150}
        autoCloseMs={8_000}
      />

      <Toast
        message={t('changelog.alreadyLastVersion')}
        onClose={onCloseDialog}
        in={isCheckUsingLastVersion}
        speedMs={150}
      />

      <Dialog
        open={isUserShowNotes}
        onClose={onCloseDialog}
        actions={
          <>
            <button className="btn" onClick={onCloseDialog}>
              Close
            </button>
            <button className="btn" onClick={onClickDownloadRelease}>
              <div className="icon">
                <DownloadIcon />
              </div>
              Download
            </button>
          </>
        }
        title={t('changelog.newVersion')}
      >
        <div className="changelog-container dark:bg-gray-700 p-4 rounded dark:text-gray-300 text-sm">
          <ReactMarkdown
            components={{
              p: Paragraph,
              h2: HeadingTwo,
              h3: HeadingThree,
              h5: HeadingFive,
              code: Code,
              a: Anchor,
            }}
          >
            {changelog}
          </ReactMarkdown>
        </div>
      </Dialog>
    </>
  )
}
