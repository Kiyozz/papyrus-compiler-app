/*
 * 2026 Kiyozz.
 */

import { useLingui } from '@lingui/react/macro'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import { bridge } from '../bridge'
import { useTelemetry } from './use-telemetry'
import type { TelemetryEventProperties } from '#common/telemetry-event.ts'

type OpenFrom =
  TelemetryEventProperties[TelemetryEvent.compilationOpenCompiledFolder]['from']

/**
 * Opens the folder the pex was written to, the file highlighted when it is
 * still there.
 */
export function useOpenCompiledFolder(): (
  pexPath: string,
  from: OpenFrom,
) => Promise<void> {
  const { t } = useLingui()
  const { send } = useTelemetry()

  return useCallback(
    async (pexPath: string, from: OpenFrom) => {
      send(TelemetryEvent.compilationOpenCompiledFolder, { from })

      const opened = await bridge.shell.showInFolder(pexPath)

      if (!opened) {
        toast.error(t`Impossible d'ouvrir le dossier`)
      }
    },
    [send, t],
  )
}
