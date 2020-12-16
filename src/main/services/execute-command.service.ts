/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { exec as originalExec } from 'child_process'
import { promisify } from 'util'
import { Logger } from '../logger'

const exec = promisify(originalExec)
const logger = new Logger('ExecuteCommand')

export function executeCommand(cmd: string, cwd?: string) {
  logger.debug('running the command', cmd, 'in the folder', cwd)

  return exec(cmd, { cwd })
}
