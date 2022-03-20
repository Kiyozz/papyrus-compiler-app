/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Button, Typography } from '@mui/material'
import cx from 'classnames'
import React, { MouseEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { MOD_DOCUMENTATION_URL } from '../../../common/env'
import { TelemetryEvent } from '../../../common/telemetry-event'
import bridge from '../../bridge'
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

const StepTooltip = ({
  next,
  text,
  selector,
  arrowPosition,
}: {
  next: Next
  text: string
  selector: string
  arrowPosition?: 'left' | 'bottom-left'
}) => {
  const { t } = useTranslation()
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
      <Button color="primary" variant="contained" onClick={onClickOk}>
        {t('tutorials.ok')}
      </Button>
    </div>,
    stepAnchor,
  )
}

const GameSettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()

  return (
    <StepTooltip
      next={next}
      text={t('tutorials.settings.game.text')}
      selector="#settings-game"
      arrowPosition="bottom-left"
    />
  )
}

const CompilerSettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()

  return (
    <StepTooltip
      next={next}
      text={t('tutorials.settings.compiler.text')}
      selector="#settings-compiler"
      arrowPosition="left"
    />
  )
}

const ConcurrentSettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()

  return (
    <StepTooltip
      next={next}
      text={t('tutorials.settings.compilation.concurrent.text')}
      selector="#compilation-concurrentScripts"
    />
  )
}

const Mo2SettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()

  return (
    <StepTooltip
      next={next}
      text={t('tutorials.settings.mo2.text')}
      selector="#settings-mo2"
      arrowPosition="bottom-left"
    />
  )
}

const Backdrop = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 z-30 bg-black-800 bg-opacity-60" />
)

/**
 * Display a help to user to configure the application
 *
 * 1. Ask if need help
 * 2. Go to settings
 * 3. Show required settings
 * 4. Information about MO2
 * 5. Show concurrent scripts
 */
const TutorialSettings = () => {
  const { t } = useTranslation()
  const { config, setConfig } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(Step.waiting)
  const { send } = useTelemetry()

  const finishTutorial = (reason: 'skip' | 'end' | 'deny') => {
    setStep(Step.end)
    setConfig({
      tutorials: {
        ...config.tutorials,
        settings: false,
      },
    })

    if (reason === 'skip') {
      send(TelemetryEvent.tutorialsSettingsSkip, { step })
    } else if (reason === 'deny') {
      send(TelemetryEvent.tutorialsSettingsDeny, {})
    } else if (reason === 'end') {
      send(TelemetryEvent.tutorialsSettingsEnd, {})
    }
  }
  const onClickDeny = () => {
    finishTutorial('deny')
  }

  const onClickNeedHelp = () => {
    navigate('/settings')
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

    bridge.shell.openExternal(MOD_DOCUMENTATION_URL)
  }

  if (!config.tutorials.settings) {
    return null
  }

  return (
    <>
      <Backdrop />
      {(step === Step.ask || step === Step.waiting) && (
        <div
          className={`fixed top-0 left-0 z-30 flex h-full w-full flex-col items-center justify-center bg-light-400 dark:bg-black-400 dark:text-white`}
        >
          <Typography variant="h3">
            {t('tutorials.settings.ask.title')}
          </Typography>
          <Typography component="div" className="m-6 text-center text-xl">
            {t('tutorials.settings.ask.text')}
          </Typography>
          <Typography variant="h6" component="div" className="mb-4 text-center">
            <Trans
              i18nKey="tutorials.settings.documentation"
              components={{
                1: (
                  <a
                    className="text-gray-700 dark:text-white"
                    href="/"
                    onClick={onClickOpenDocumentation}
                  />
                ),
              }}
            />
          </Typography>
          <div className="flex gap-4">
            <Button
              color="primary"
              variant="contained"
              onClick={onClickNeedHelp}
              disabled={step === Step.waiting}
            >
              {t('tutorials.settings.ask.needHelp')}
            </Button>
            <Button onClick={onClickDeny} disabled={step === Step.waiting}>
              {t('tutorials.close')}
            </Button>
          </div>
        </div>
      )}

      {step !== Step.ask &&
        step !== Step.waiting &&
        createPortal(
          <Button
            onClick={onClickSkip}
            color="primary"
            variant="contained"
            className="fixed top-12 right-4 z-40 text-right text-white"
          >
            {t('common.skip')}
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
