/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { exec as originalExec } from 'child_process'
import { promisify } from 'util'
import { is } from 'electron-util'
import { Logger } from '../logger'

const exec = promisify(originalExec)
const logger = new Logger('ExecuteCommand')

export function executeCommand(
  cmd: string,
  cwd?: string,
): Promise<{ stdout: string; stderr: string }> {
  logger.debug('running the command', cmd, 'in the folder', cwd)

  return exec(`${is.windows ? '& ' : ''}${cmd}`, {
    cwd,
    shell: is.windows ? 'powershell' : undefined,
  })
}
