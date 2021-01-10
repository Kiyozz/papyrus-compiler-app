/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../page-context'

enum Step {
  ASK,
  GAME,
  COMPILER,
  MO2,
  END
}

type Next = () => void

function getGameSettingsAnchor() {
  return document.querySelector('#settings-game')
}

function getCompilerSettingsAnchor() {
  return document.querySelector('#settings-compiler')
}

function getMO2SettingsAnchor() {
  return document.querySelector('#settings-mo2')
}

function GameSettingsStep({ next }: { next: Next }) {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getGameSettingsAnchor(), [])

  const onClickOk = useCallback(() => next(), [next])

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="bg-darker -top-12 tooltip tooltip-left">
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
    <div className="bg-darker -top-14 tooltip">
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

function MO2SettingsStep({ next }: { next: Next }) {
  const { t } = useTranslation()
  const stepAnchor = useMemo(() => getMO2SettingsAnchor(), [])
  const onClickOk = useCallback(() => next(), [next])

  if (!stepAnchor) {
    return null
  }

  return createPortal(
    <div className="bg-darker -top-12 tooltip tooltip-left">
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

function Overlay() {
  return (
    <div className="fixed z-10 bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0" />
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
export function TutorialSettings() {
  const { t } = useTranslation()
  const { config, updateConfig } = usePageContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(Step.ASK)

  const onClickClose = useCallback(() => {
    updateConfig({
      tutorials: {
        ...config.tutorials,
        settings: false
      }
    })
  }, [config.tutorials, updateConfig])

  const onClickNeedHelp = useCallback(() => {
    navigate('/settings').then(() => {
      setStep(Step.GAME)
    })
  }, [navigate])

  const onNextStepOne = useCallback(() => {
    setStep(Step.COMPILER)
  }, [])

  const onNextStepTwo = useCallback(() => {
    setStep(Step.MO2)
  }, [])

  const onNextStepThree = useCallback(() => {
    setStep(Step.END)
    updateConfig({
      tutorials: {
        settings: false
      }
    })
  }, [updateConfig])

  if (!config.tutorials.settings) {
    return null
  }

  return (
    <>
      <Overlay />
      {step === Step.ASK && (
        <div className="fixed top-0 left-0 w-full h-full bg-black z-10 flex flex-col justify-center items-center">
          <div className="text-3xl">{t('tutorials.settings.ask.title')}</div>
          <div className="m-6 text-xl text-center">
            {t('tutorials.settings.ask.text')}
          </div>
          <div className="flex gap-4">
            <button className="btn btn-primary" onClick={onClickNeedHelp}>
              {t('tutorials.settings.ask.needHelp')}
            </button>
            <button className="btn" onClick={onClickClose}>
              {t('tutorials.close')}
            </button>
          </div>
        </div>
      )}

      {step === Step.GAME && <GameSettingsStep next={onNextStepOne} />}

      {step === Step.COMPILER && <CompilerSettingsStep next={onNextStepTwo} />}

      {step === Step.MO2 && <MO2SettingsStep next={onNextStepThree} />}
    </>
  )
}
