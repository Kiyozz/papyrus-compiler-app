/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { useNavigate } from '@reach/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { useApp } from '../../hooks/use-app'
import { useFocus } from '../../hooks/use-focus'

enum Step {
  Waiting,
  Ask,
  Game,
  Compiler,
  Mo2,
  Concurrent,
  End
}

type Next = () => void

function getGameSettingsAnchor() {
  return document.querySelector('#settings-game')
}

function getCompilerSettingsAnchor() {
  return document.querySelector('#settings-compiler')
}

function getMo2SettingsAnchor() {
  return document.querySelector('#settings-mo2')
}

function getConcurrentSettingsAnchor() {
  return document.querySelector('#compilation-concurrentScripts')
}

function GameSettingsStep({ next }: { next: Next }) {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getGameSettingsAnchor(), [])

  const onClickOk = useCallback(() => next(), [next])

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="bg-light-800 dark:bg-darker shadow top-0 left-24 tooltip tooltip-left">
      <div>{t('tutorials.settings.game.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor
  )
}

function CompilerSettingsStep({ next }: { next: Next }) {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getCompilerSettingsAnchor(), [])
  const onClickOk = useCallback(() => next(), [next])

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="bg-light-800 dark:bg-darker -top-14 tooltip">
      <div>{t('tutorials.settings.compiler.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor
  )
}

function Mo2SettingsStep({ next }: { next: Next }) {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getMo2SettingsAnchor(), [])
  const onClickOk = useCallback(() => next(), [next])

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="bg-light-800 dark:bg-darker -top-12 tooltip tooltip-bottom-left">
      <div>{t('tutorials.settings.mo2.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor
  )
}

function ConcurrentSettingsStep({ next }: { next: Next }) {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getConcurrentSettingsAnchor(), [])
  const onClickOk = useCallback(() => next(), [next])

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="bg-light-800 dark:bg-darker -top-12 tooltip">
      <div>{t('tutorials.settings.compilation.concurrent.text')}</div>
      <div>
        <button className="btn btn-primary" onClick={onClickOk}>
          {t('tutorials.ok')}
        </button>
      </div>
    </div>,
    stepAnchor
  )
}

function Overlay() {
  return (
    <div className="fixed z-20 bg-black-800 bg-opacity-60 top-0 left-0 right-0 bottom-0" />
  )
}

/**
 * Display a help to user to configure the application
 *
 * 1. Ask if need help
 * 2. Go to settings
 * 3. Show required settings
 * 4. Information about MO2
 */
export function TutorialSettings(): JSX.Element | null {
  const { t } = useTranslation()
  const { config, setConfig } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(Step.Waiting)
  const isFocus = useFocus()

  const onClickClose = useCallback(() => {
    setConfig({
      tutorials: {
        ...config.tutorials,
        settings: false
      }
    })
  }, [config.tutorials, setConfig])

  const onClickNeedHelp = useCallback(() => {
    navigate('/settings').then(() => {
      setStep(Step.Game)
    })
  }, [navigate])

  const onNextStepGame = useCallback(() => {
    setStep(Step.Compiler)
  }, [])

  const onNextStepCompiler = useCallback(() => {
    setStep(Step.Concurrent)
  }, [])

  const onNextStepConcurrent = useCallback(() => {
    setStep(Step.Mo2)
  }, [])

  const onNextStepMo2 = useCallback(() => {
    setStep(Step.End)
    setConfig({
      tutorials: {
        settings: false
      }
    })
  }, [setConfig])

  useEffect(() => {
    const time = setTimeout(() => {
      setStep(Step.Ask)
    }, 1000)

    return () => clearTimeout(time)
  }, [])

  if (!config.tutorials.settings) {
    return null
  }

  return (
    <>
      <Overlay />
      {(step === Step.Ask || step === Step.Waiting) && (
        <div
          className={`fixed top-0 left-0 w-full h-full ${
            isFocus
              ? 'bg-light-400 dark:bg-black-800'
              : 'bg-light-600 dark:bg-black-600'
          } z-20 flex flex-col justify-center items-center`}
        >
          <div className="text-3xl font-bold">
            {t('tutorials.settings.ask.title')}
          </div>
          <div className="m-6 text-xl text-center">
            {t('tutorials.settings.ask.text')}
          </div>
          <div className="flex gap-4">
            <button
              className="btn btn-primary"
              onClick={onClickNeedHelp}
              disabled={step === Step.Waiting}
            >
              {t('tutorials.settings.ask.needHelp')}
            </button>
            <button
              className="btn"
              onClick={onClickClose}
              disabled={step === Step.Waiting}
            >
              {t('tutorials.close')}
            </button>
          </div>
        </div>
      )}

      {step === Step.Game && <GameSettingsStep next={onNextStepGame} />}

      {step === Step.Compiler && (
        <CompilerSettingsStep next={onNextStepCompiler} />
      )}

      {step === Step.Concurrent && (
        <ConcurrentSettingsStep next={onNextStepConcurrent} />
      )}

      {step === Step.Mo2 && <Mo2SettingsStep next={onNextStepMo2} />}
    </>
  )
}
