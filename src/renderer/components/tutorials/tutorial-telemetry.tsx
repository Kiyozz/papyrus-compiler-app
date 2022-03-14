/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useApp } from '../../hooks/use-app'
import { useFocus } from '../../hooks/use-focus'

const TutorialTelemetry = () => {
  const { setConfig } = useApp()
  const isFocus = useFocus()
  const { t } = useTranslation()
  const [isWaiting, setWaiting] = useState(true)

  const onClickOk = () => {
    setConfig({
      tutorials: {
        telemetry: false,
      },
    })
  }

  useEffect(() => {
    setTimeout(() => setWaiting(false), 2000)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 h-full w-full ${
        isFocus
          ? 'bg-light-400 dark:bg-black-800'
          : 'bg-light-600 dark:bg-black-400'
      } z-20 flex flex-col items-center justify-center`}
    >
      <div className="px-8">
        <Trans i18nKey="tutorials.telemetry.text">
          <div className="text-md" />
          <div className="mt-2" />
          <div className="mt-2" />
          <div className="mt-6 text-sm" />
        </Trans>
      </div>
      <button
        className="btn btn-primary mt-8"
        onClick={onClickOk}
        disabled={isWaiting}
      >
        {t('tutorials.telemetry.close')}
      </button>
    </div>
  )
}

export default TutorialTelemetry
