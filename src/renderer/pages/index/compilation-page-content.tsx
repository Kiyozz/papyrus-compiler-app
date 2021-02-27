/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ScriptInterface } from '../../interfaces'
import { useCompilation } from '../../hooks/use-compilation'
import { CompilationPageActions } from './compilation-page-actions'
import { PlayButton } from './play-button'
import { ScriptItem } from './script-item'

interface Props {
  onClickRemoveScriptFromScript: (script: ScriptInterface) => () => void
  onClear: () => void
  onClickStart: () => void
}

export function CompilationPageContent({
  onClear,
  onClickStart,
  onClickRemoveScriptFromScript
}: Props) {
  const { t } = useTranslation()
  const { scripts } = useCompilation()

  const scriptsList: JSX.Element[] = useMemo(() => {
    return scripts.map(script => {
      return (
        <ScriptItem
          key={script.id}
          onClickRemoveScript={onClickRemoveScriptFromScript(script)}
          script={script}
        />
      )
    })
  }, [scripts, onClickRemoveScriptFromScript])

  return (
    <>
      <div className="flex pb-4 gap-2">
        <PlayButton onClick={onClickStart} />

        <CompilationPageActions onClearScripts={onClear} />
      </div>

      {scripts.length > 0 ? (
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
