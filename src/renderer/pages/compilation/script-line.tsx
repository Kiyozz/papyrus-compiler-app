/*
 * 2022-2026 Kiyozz.
 */

import { Button } from '@renderer/components/ui/button.tsx'
import { useSettings } from '@renderer/pages/settings/use-settings.tsx'
import type { ScriptRenderer } from '@renderer/types'
import { IconFromStatus } from '@renderer/utils/scripts/from-status.tsx'
import { isRunningScript } from '@renderer/utils/scripts/status.ts'
import { PlayIcon, TrashIcon } from 'lucide-react'
import { useLingui } from '@lingui/react/macro'

interface ScriptLineProps {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
  onClickPlayCompilation: (script: ScriptRenderer) => void
}

function ScriptLine({
  script,
  onClickRemoveScript,
  onClickPlayCompilation,
}: ScriptLineProps) {
  const { t } = useLingui()
  const { configError } = useSettings()

  const onClickRemove = () => {
    onClickRemoveScript(script)
  }

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 first:rounded-t-md last:rounded-b-md hover:bg-accent/75">
      <Button
        size="icon-sm"
        className="size-6 rounded-full"
        disabled={configError !== false || isRunningScript(script)}
        onClick={onClickPlay}
      >
        <PlayIcon className="size-3.5" />
      </Button>
      <span className="flex-1 font-mono text-sm">{script.name}</span>
      <IconFromStatus script={script} className="size-4" />
      <Button
        size="icon-sm"
        disabled={isRunningScript(script)}
        onClick={onClickRemove}
        variant="destructive"
        aria-label={t`Retirer`}
        className="size-6"
      >
        <TrashIcon className="size-3.5" />
      </Button>
    </div>
  )
}

export default ScriptLine
