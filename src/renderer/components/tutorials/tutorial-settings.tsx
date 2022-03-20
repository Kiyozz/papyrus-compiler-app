/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Button } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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

const getGameSettingsAnchor = () => document.querySelector('#settings-game')

const getCompilerSettingsAnchor = () =>
  document.querySelector('#settings-compiler')

const getMo2SettingsAnchor = () => document.querySelector('#settings-mo2')

const getConcurrentSettingsAnchor = () =>
  document.querySelector('#compilation-concurrentScripts')

const GameSettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()
  const [stepAnchor, setAnchor] = useState(getGameSettingsAnchor)

  useEffect(() => {
    setAnchor(getGameSettingsAnchor())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const onClickOk = () => next()

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="tooltip tooltip-left">
      <div>{t('tutorials.settings.game.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor,
  )
}

const CompilerSettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getCompilerSettingsAnchor(), [])
  const onClickOk = () => next()

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="tooltip -top-14 bg-light-800 dark:bg-darker">
      <div>{t('tutorials.settings.compiler.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor,
  )
}

const Mo2SettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getMo2SettingsAnchor(), [])

  const onClickOk = () => next()

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="tooltip tooltip-bottom-left -top-12 bg-light-800 dark:bg-darker">
      <div>{t('tutorials.settings.mo2.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor,
  )
}

const ConcurrentSettingsStep = ({ next }: { next: Next }) => {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getConcurrentSettingsAnchor(), [])
  const onClickOk = () => next()

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="tooltip -top-12 bg-light-800 dark:bg-darker">
      <div>{t('tutorials.settings.compilation.concurrent.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor,
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

  const onClickClose = () => {
    send(TelemetryEvent.tutorialsSettingsDeny, {})
    setConfig({
      tutorials: {
        ...config.tutorials,
        settings: false,
      },
    })
  }

  const onClickNeedHelp = useCallback(() => {
    navigate('/settings')
    setStep(Step.game)
  }, [navigate])

  const onNextStepGame = useCallback(() => {
    setStep(Step.compiler)
  }, [])

  const onNextStepCompiler = useCallback(() => {
    setStep(Step.concurrent)
  }, [])

  const onNextStepConcurrent = useCallback(() => {
    setStep(Step.mo2)
  }, [])

  const onNextStepMo2 = useCallback(() => {
    setStep(Step.end)
    setConfig({
      tutorials: {
        settings: false,
      },
    })
  }, [setConfig])

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
          <div className="text-3xl font-bold">
            {t('tutorials.settings.ask.title')}
          </div>
          <div className="m-6 text-center text-xl">
            {t('tutorials.settings.ask.text')}
          </div>
          <div className="flex gap-4">
            <Button
              color="primary"
              variant="contained"
              onClick={onClickNeedHelp}
              disabled={step === Step.waiting}
            >
              {t('tutorials.settings.ask.needHelp')}
            </Button>
            <Button onClick={onClickClose} disabled={step === Step.waiting}>
              {t('tutorials.close')}
            </Button>
          </div>
        </div>
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
