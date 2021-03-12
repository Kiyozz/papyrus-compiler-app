/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import CloseIcon from '@material-ui/icons/Close'
import DownloadIcon from '@material-ui/icons/GetApp'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

import { MOD_URL } from '../../../common/mod'
import { useApp } from '../../hooks/use-app'
import useOnKeyUp from '../../hooks/use-on-key-up'
import { Dialog } from './dialog'

function Anchor({ children, href }: React.PropsWithChildren<{ href: string }>) {
  const shell = useMemo(() => window.require('electron').shell, [])
  const onClick = useCallback(() => shell.openExternal(href), [href, shell])

  return <a onClick={onClick}>{children}</a>
}

function Heading({
  children,
  level
}: React.PropsWithChildren<{ level: number }>) {
  if (level === 2) {
    return <h6 className="mb-2 text-2xl">{children}</h6>
  }

  return <h5 className="mb-2 text-xl">{children}</h5>
}

function Paragraph({ children }: React.PropsWithChildren<unknown>) {
  return <p className="text-sm">{children}</p>
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

export function DialogChangelog(): JSX.Element {
  const shell = useMemo(() => window.require('electron').shell, [])
  const { t } = useTranslation()
  const {
    isShowChangelog,
    changelog,
    latestVersion,
    setShowChangelog
  } = useApp()

  const [isUserShowNotes, setUserShowNotes] = useState(false)

  const onClickDownloadRelease = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      shell.openExternal(MOD_URL)
    },
    [shell]
  )

  const onClickShowNotes = useCallback(() => {
    if (isShowChangelog) {
      setUserShowNotes(true)
    }
  }, [isShowChangelog])

  const onCloseDialog = useCallback(() => {
    setUserShowNotes(false)
    setShowChangelog(false)
  }, [setShowChangelog])

  useOnKeyUp('Escape', () => {
    setShowChangelog(false)
  })

  return (
    <>
      {isShowChangelog && !isUserShowNotes && (
        <div className="fixed z-20 bottom-3 left-3 bg-gray-800 py-3 items-center rounded text-sm text-white flex">
          <div className="px-2">
            {t('changelog.available.message', { version: latestVersion })}
          </div>
          <div className="inline-flex gap-2 pr-2">
            <button className="btn btn-primary" onClick={onClickShowNotes}>
              {t('changelog.available.view')}
            </button>
            <button
              className="btn-icon text-xs"
              aria-label="close"
              onClick={onCloseDialog}
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        </div>
      )}

      <Dialog
        open={isUserShowNotes}
        fullWidth
        maxWidth={70}
        onClose={onCloseDialog}
        actions={
          <>
            <button className="btn" onClick={onCloseDialog}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={onClickDownloadRelease}
            >
              <div className="icon">
                <DownloadIcon />
              </div>
              Download
            </button>
          </>
        }
        title={t('changelog.newVersion')}
      >
        <div className="changelog-container bg-gray-700 p-4 rounded text-gray-300 text-sm">
          <ReactMarkdown
            source={changelog}
            renderers={{
              paragraph: Paragraph,
              heading: Heading,
              code: Code,
              link: Anchor
            }}
          />
        </div>
      </Dialog>
    </>
  )
}
