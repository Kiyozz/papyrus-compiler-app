/*
 * 2022-2026 Kiyozz.
 */

import { bridge } from '@renderer/bridge.ts'
import { Button, Typography } from '@mui/material'
import cx from 'classnames'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Trans, useLingui } from '@lingui/react/macro'
import { useNavigate } from '@tanstack/react-router'
import { MOD_DOCUMENTATION_URL } from '../../../common/env'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { useApp } from '../../hooks/use-app'
import { useTelemetry } from '../../hooks/use-telemetry'

enum Step {
  waiting,
  ask,
  game,
  compiler,
  concurrent,
  mo2,
  end,
}

type Next = () => void

function StepTooltip({
  next,
  text,
  selector,
  arrowPosition,
}: {
  next: Next
  text: string
  selector: string
  arrowPosition?: 'left' | 'bottom-left'
}) {
  const [stepAnchor, setAnchor] = useState(() =>
    document.querySelector(selector),
  )

  useEffect(() => {
    setAnchor(document.querySelector(selector))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const onClickOk = () => next()

  if (!stepAnchor) return null

  return createPortal(
    <div
      className={cx(
        'tooltip',
        arrowPosition === 'left' && 'tooltip-left',
        arrowPosition === 'bottom-left' && 'tooltip-bottom-left',
      )}
    >
      <Typography>{text}</Typography>
      <Button color="primary" onClick={onClickOk} variant="contained">
        <Trans>OK</Trans>
      </Button>
    </div>,
    stepAnchor,
  )
}

function GameSettingsStep({ next }: { next: Next }) {
  const { t } = useLingui()

  return (
    <StepTooltip
      arrowPosition="bottom-left"
      next={next}
      selector="#settings-game"
      text={t`Ici, vous pouvez enregistrer les informations de votre jeu`}
    />
  )
}

function CompilerSettingsStep({ next }: { next: Next }) {
  const { t } = useLingui()

  return (
    <StepTooltip
      arrowPosition="left"
      next={next}
      selector="#settings-compiler"
      text={t`Ici, vous pouvez enregistrer le chemin vers le compilateur Papyrus. Disponible après l'installation de Creation Kit`}
    />
  )
}

function ConcurrentSettingsStep({ next }: { next: Next }) {
  const { t } = useLingui()

  return (
    <StepTooltip
      next={next}
      selector="#compilation-concurrentScripts"
      text={t`Ici, vous pouvez enregistrer le nombre de scripts compilés simultanéments.`}
    />
  )
}

function Mo2SettingsStep({ next }: { next: Next }) {
  const { t } = useLingui()

  return (
    <StepTooltip
      arrowPosition="bottom-left"
      next={next}
      selector="#settings-mo2"
      text={t`Ici, vous pouvez enregistrer vos informations MO2. Ignorez cette option, si vous utilisez PCA à travers MO2`}
    />
  )
}

function Backdrop() {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-30 bg-black-800 bg-opacity-60" />
  )
}

/**
 * Display a help to user to configure the application
 *
 * 1. Ask if need help
 * 2. Go to settings
 * 3. Show required settings
 * 4. Information about MO2
 * 5. Show concurrent scripts
 */
function TutorialSettings() {
  const { config, setConfig } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(Step.waiting)
  const { send } = useTelemetry()

  const finishTutorial = (reason: 'skip' | 'end' | 'deny') => {
    setStep(Step.end)
    setConfig({
      tutorials: {
        settings: false,
      },
    })

    if (reason === 'skip') {
      send(TelemetryEvent.tutorialsSettingsSkip, { step })
    } else if (reason === 'deny') {
      send(TelemetryEvent.tutorialsSettingsDeny, {})
    } else {
      send(TelemetryEvent.tutorialsSettingsEnd, {})
    }
  }
  const onClickDeny = () => {
    finishTutorial('deny')
  }

  const onClickNeedHelp = () => {
    void navigate({ to: '/settings' })
    setStep(Step.game)
  }

  const onNextStepGame = () => {
    setStep(Step.compiler)
  }

  const onNextStepCompiler = () => {
    setStep(Step.concurrent)
  }

  const onNextStepConcurrent = () => {
    setStep(Step.mo2)
  }

  const onNextStepMo2 = () => {
    finishTutorial('end')
  }

  const onClickSkip = () => {
    finishTutorial('skip')
  }

  useEffect(() => {
    if (step === Step.waiting) {
      send(TelemetryEvent.appFirstLoaded, {})
    }

    if (step === Step.end) {
      send(TelemetryEvent.tutorialsSettingsEnd, {})
    }
  }, [step, send])

  useEffect(() => {
    const time = setTimeout(() => {
      setStep(Step.ask)
    }, 1000)

    return () => clearTimeout(time)
  }, [])

  const onClickOpenDocumentation = (evt: MouseEvent) => {
    evt.preventDefault()

    void bridge.shell.openExternal(MOD_DOCUMENTATION_URL)
  }

  if (!config.tutorials.settings) {
    return null
  }

  return (
    <>
      <Backdrop />
      {(step === Step.ask || step === Step.waiting) && (
        <div className="fixed top-0 left-0 z-30 flex h-full w-full flex-col items-center justify-center bg-light-400 dark:bg-black-400 dark:text-white">
          <Typography variant="h3">
            <Trans>Configurer PCA</Trans>
          </Typography>
          <Typography className="m-6 text-center text-xl" component="div">
            <Trans>C'est la première fois que vous lancez PCA.</Trans>
          </Typography>
          <Typography className="mb-4 text-center" component="div" variant="h6">
            <Trans>
              La documentation de PCA est{' '}
              <a
                className="text-gray-700 dark:text-white"
                href="/"
                onClick={onClickOpenDocumentation}
              >
                disponible ici
              </a>
              .
            </Trans>
          </Typography>
          <div className="flex gap-4">
            <Button
              color="primary"
              disabled={step === Step.waiting}
              onClick={onClickNeedHelp}
              variant="contained"
            >
              <Trans>J'ai besoin d'aide</Trans>
            </Button>
            <Button disabled={step === Step.waiting} onClick={onClickDeny}>
              <Trans>Fermer</Trans>
            </Button>
          </div>
        </div>
      )}

      {step !== Step.ask &&
        step !== Step.waiting &&
        createPortal(
          <Button
            className="fixed top-12 right-4 z-40 text-right text-white"
            color="primary"
            onClick={onClickSkip}
            variant="contained"
          >
            <Trans>Passer</Trans>
          </Button>,
          document.body,
        )}

      {step === Step.game && <GameSettingsStep next={onNextStepGame} />}

      {step === Step.compiler && (
        <CompilerSettingsStep next={onNextStepCompiler} />
      )}

      {step === Step.concurrent && (
        <ConcurrentSettingsStep next={onNextStepConcurrent} />
      )}

      {step === Step.mo2 && <Mo2SettingsStep next={onNextStepMo2} />}
    </>
  )
}

export default TutorialSettings
