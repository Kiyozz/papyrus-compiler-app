/*
 * 2022-2026 Kiyozz.
 */

import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useApp } from '../../hooks/use-app'

function TutorialTelemetry() {
  const { setConfig } = useApp()
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
        <div className="text-md">
          <Trans>
            À partir de la version 5.5.0, PCA collectera des données de
            télémétrie dans le but d'analyser les fonctionnalités utilisées et
            d'améliorer les fonctionnalités pertinentes.
          </Trans>
        </div>
        <div className="mt-2">
          <Trans>Toutes les données transmises sont anonymes.</Trans>
        </div>
        <div className="mt-2">
          <Trans>
            Des exemples de données collectées comprennent les données de groupe
            et de compilation, les erreurs, et les horodatages de divers
            événements d'application.
          </Trans>
        </div>
        <div className="mt-6 text-sm">
          <Trans>
            Les données de télémétrie sont désactivables dans les paramètres.
          </Trans>
        </div>
      </div>
      <Button
        className="mt-8"
        color="primary"
        disabled={isWaiting}
        onClick={onClickOk}
        variant="contained"
      >
        <Trans>J'ai compris</Trans>
      </Button>
    </div>
  )
}

export default TutorialTelemetry
