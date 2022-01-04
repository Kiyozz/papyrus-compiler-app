/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import DownloadIcon from '@material-ui/icons/GetApp'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown, { Components } from 'react-markdown'

import { GITHUB_LINK } from '../../../common/constants'
import bridge from '../../bridge'
import { Env } from '../../env'
import { useApp } from '../../hooks/use-app'
import { useInitialization } from '../../hooks/use-initialization'
import { useOnKeyUp } from '../../hooks/use-on-key-up'
import Toast from '../toast'
import Dialog from './dialog'

const Img: Components['img'] = ({ src, alt, ...props }) => {
  const newSrc = src?.startsWith('docs')
    ? `${GITHUB_LINK}/blob/master/${src}?raw=true`
    : src

  return <img src={newSrc} alt={alt} {...props} />
}

const Anchor = ({
  children,
  href,
}: React.PropsWithChildren<React.HTMLProps<HTMLAnchorElement>>) => {
  const onClick = () => {
    if (href) {
      bridge.shell.openExternal(href)
    }
  }

  return <a onClick={onClick}>{children}</a>
}

const HeadingOne = ({ children }: React.PropsWithChildren<unknown>) => (
  <h1 className="mb-2 text-4xl">{children}</h1>
)

const HeadingTwo = ({ children }: React.PropsWithChildren<unknown>) => (
  <h6 className="mb-2 text-2xl">{children}</h6>
)

const HeadingFive = ({ children }: React.PropsWithChildren<unknown>) => (
  <h5 className="mb-2 text-xl">{children}</h5>
)

const HeadingThree = ({ children }: React.PropsWithChildren<unknown>) => (
  <h3 className="mb-2 text-xl">{children}</h3>
)

const Paragraph = ({ children }: React.PropsWithChildren<unknown>) => (
  <p className="text-sm">{children}</p>
)

const Code = ({ children }: { children: React.ReactNode[] }) => (
  <code className="dark:bg-gray-800 markdown-code">{children}</code>
)

const DialogChangelog = () => {
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

    bridge.shell.openExternal(Env.modUrl)
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
              h1: HeadingOne,
              h2: HeadingTwo,
              h3: HeadingThree,
              h5: HeadingFive,
              code: Code,
              a: Anchor,
              img: Img,
            }}
          >
            {changelog}
          </ReactMarkdown>
        </div>
      </Dialog>
    </>
  )
}

export default DialogChangelog
