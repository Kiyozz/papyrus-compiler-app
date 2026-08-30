/*
 * 2022-2026 Kiyozz.
 */

import { Button } from '@renderer/components/ui/button.tsx'
import { useSettings } from '@renderer/pages/settings/use-settings.tsx'
import type { ScriptRenderer } from '@renderer/types'
import { IconFromStatus } from '@renderer/utils/scripts/from-status.tsx'
import { isRunningScript } from '@renderer/utils/scripts/status.ts'
import { FolderOpenIcon, PlayIcon, TrashIcon } from 'lucide-react'
import { Trans, useLingui } from '@lingui/react/macro'
import { useOpenCompiledFolder } from '@renderer/hooks/use-open-compiled-folder.ts'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@renderer/components/ui/tooltip.tsx'

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
  const { hasBlockingError } = useSettings()
  const openCompiledFolder = useOpenCompiledFolder()

  const onClickRemove = () => {
    onClickRemoveScript(script)
  }

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  const onClickOpenFolder = () => {
    if (script.pexPath === undefined) return

    void openCompiledFolder(script.pexPath, 'script-line')
  }

  return (
    <div className="flex items-center gap-2 p-1 group-first:rounded-t-xl group-last:rounded-b-xl hover:bg-accent/75">
      <Button
        size="icon-sm"
        className="size-6 rounded-full"
        disabled={hasBlockingError || isRunningScript(script)}
        onClick={onClickPlay}
      >
        <PlayIcon className="size-3.5" />
      </Button>
      <span className="flex-1 font-mono text-sm">{script.name}</span>
      <IconFromStatus script={script} className="size-4" />
      <TooltipProvider delay={500}>
        <Tooltip disableHoverablePopup>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant="secondary"
                disabled={
                  isRunningScript(script) || script.pexPath === undefined
                }
                onClick={onClickOpenFolder}
                aria-label={t`Ouvrir le dossier du script compilé`}
                className="size-6"
              />
            }
          >
            <FolderOpenIcon className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent>
            <Trans>Ouvrir le dossier du script compilé</Trans>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
