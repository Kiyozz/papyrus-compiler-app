/*
 * 2026 Kiyozz.
 */

import type { CompilationLog } from '@renderer/types/index.ts'

export function logsState(logs: CompilationLog[]) {
  const hasNoLogs = logs.length === 0
  const hasLogs = logs.length > 0
  const hasErrorsInLogs = logs.some((log) => !log.success)
  const isAllScriptsSuccessInLogs = hasLogs && logs.every((log) => log.success)

  return {
    hasNoLogs,
    hasLogs,
    hasErrorsInLogs,
    isAllScriptsSuccessInLogs,
  }
}
