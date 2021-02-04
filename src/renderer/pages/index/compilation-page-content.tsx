/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ScriptInterface } from '../../interfaces'
import { useCompilationContext } from './compilation-context'
import { CompilationPageActions } from './compilation-page-actions'
import { PlayButton } from './play-button'
import { ScriptItem } from './script-item'

interface Props {
  onClickRemoveScriptFromScript: (script: ScriptInterface) => () => void
  onClear: () => void
  onClickPlayPause: () => void
}

export function CompilationPageContent({
  onClear,
  onClickPlayPause,
  onClickRemoveScriptFromScript
}: Props) {
  const { t } = useTranslation()
  const { compilationScripts } = useCompilationContext()

  const scriptsList: JSX.Element[] = useMemo(() => {
    return compilationScripts.map(script => {
      return (
        <ScriptItem
          key={script.id}
          onClickRemoveScript={onClickRemoveScriptFromScript(script)}
          script={script}
        />
      )
    })
  }, [compilationScripts, onClickRemoveScriptFromScript])

  return (
    <>
      <div className="flex mb-4 gap-2">
        <PlayButton onClick={onClickPlayPause} />

        <CompilationPageActions
          hasScripts={scriptsList.length > 0}
          onClearScripts={onClear}
        />
      </div>

      {compilationScripts.length > 0 ? (
        <div className="flex flex-col gap-2">{scriptsList}</div>
      ) : (
        <>
          <p>{t('page.compilation.dragAndDropText')}</p>
          <p>{t('page.compilation.dragAndDropAdmin')}</p>
        </>
      )}
    </>
  )
}
