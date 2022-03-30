/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/use-app'

function TutorialTelemetry() {
  const { setConfig } = useApp()
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
    const time = setTimeout(() => setWaiting(false), 2000)

    return () => clearTimeout(time)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-30 flex h-full w-full flex-col items-center justify-center bg-light-400 dark:bg-black-400">
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
        disabled={isWaiting}
        onClick={onClickOk}
        type="button"
      >
        {t('tutorials.telemetry.close')}
      </button>
    </div>
  )
}

export default TutorialTelemetry
