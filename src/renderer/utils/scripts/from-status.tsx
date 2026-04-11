/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '@renderer/enums/script-status.enum.ts'
import { cn } from '@renderer/lib/utils.ts'
import type { ScriptRenderer } from '@renderer/types/index.ts'
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

export const IconFromStatus = ({
  script,
  className,
}: {
  script: ScriptRenderer
  className?: string
}) => {
  switch (script.status) {
    case ScriptStatus.idle:
      return null
    case ScriptStatus.running:
      return (
        <HourglassIcon className={cn(classNameFromStatus(script), className)} />
      )
    case ScriptStatus.success:
      return (
        <CircleCheckIcon
          className={cn(classNameFromStatus(script), className)}
        />
      )
    default:
      return (
        <CircleXIcon className={cn(classNameFromStatus(script), className)} />
      )
  }
}
