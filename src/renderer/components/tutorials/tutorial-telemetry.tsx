/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Button } from '@mui/material'
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
      <Button
        className="mt-8"
        color="primary"
        disabled={isWaiting}
        onClick={onClickOk}
        variant="contained"
      >
        {t('tutorials.telemetry.close')}
      </Button>
    </div>
  )
}

export default TutorialTelemetry
