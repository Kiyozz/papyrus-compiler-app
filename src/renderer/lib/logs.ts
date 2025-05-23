import type { ScriptRenderer } from '@/types'
import { isFailedScript, isSuccessScript } from '@/utils/scripts/status.ts'

export function logsState(logs: [ScriptRenderer, string][]) {
  const hasNoLogs = logs.length === 0
  const hasLogs = logs.length > 0
  const hasErrorsInLogs = logs.some(([log]) => isFailedScript(log))
  const isAllScriptsSuccessInLogs = hasLogs && logs.every(([log]) => isSuccessScript(log))

  return {
    hasNoLogs,
    hasLogs,
    hasErrorsInLogs,
    isAllScriptsSuccessInLogs,
  }
}
