/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '@/enums/script-status.enum.ts'
import type { ScriptRenderer } from '@/types/index.ts'
import { CircleCheckIcon, CircleXIcon, HourglassIcon } from 'lucide-react'

const classNameFromStatus = (script: ScriptRenderer): string => {
  switch (script.status) {
    case ScriptStatus.idle:
      return 'text-black-600 dark:text-gray-500'
    case ScriptStatus.running:
      return 'text-blue-800 dark:text-blue-600'
    case ScriptStatus.success:
      return 'text-green-500 dark:text-green-400'
    default:
      return 'text-destructive'
  }
}

export const IconFromStatus = ({ script }: { script: ScriptRenderer }) => {
  switch (script.status) {
    case ScriptStatus.idle:
      return null
    case ScriptStatus.running:
      return <HourglassIcon className={classNameFromStatus(script)} />
    case ScriptStatus.success:
      return <CircleCheckIcon className={classNameFromStatus(script)} />
    default:
      return <CircleXIcon className={classNameFromStatus(script)} />
  }
}
