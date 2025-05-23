/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useTranslation } from 'react-i18next'
import type { ScriptRenderer } from '@/types'
import { IconFromStatus } from '@/utils/scripts/from-status.tsx'
import { isRunningScript } from '@/utils/scripts/status.ts'
import { Button } from '@/components/ui/button.tsx'
import { PlayIcon, TrashIcon } from 'lucide-react'
import { useSettings } from '@/pages/settings/use-settings.tsx'

interface ScriptLineProps {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
  onClickPlayCompilation: (script: ScriptRenderer) => void
}

function ScriptLine({ script, onClickRemoveScript, onClickPlayCompilation }: ScriptLineProps) {
  const { t } = useTranslation()
  const { configError } = useSettings()

  const onClickRemove = () => {
    onClickRemoveScript(script)
  }

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  return (
    <li className="flex w-full items-center gap-2 rounded-lg p-2 text-sm hover:bg-secondary/75 border">
      <Button
        size="icon-sm"
        className="rounded-full"
        disabled={configError !== false || isRunningScript(script)}
        onClick={onClickPlay}
      >
        <PlayIcon />
      </Button>
      <span className="flex-1 font-mono">{script.name}</span>
      <IconFromStatus script={script} />
      <Button
        size="icon-sm"
        disabled={isRunningScript(script)}
        onClick={onClickRemove}
        variant="destructive"
        aria-label={t('common.remove')}
      >
        <TrashIcon />
      </Button>
    </li>
  )
}

export default ScriptLine
