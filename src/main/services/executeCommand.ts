import { exec as originalExec } from 'child_process'
import { promisify } from 'util'
import { Logger } from '../Logger'

const exec = promisify(originalExec)
const logger = new Logger('ExecuteCommand')

export function executeCommand(cmd: string, cwd?: string) {
  logger.debug('Executing in directory', cwd, 'Command', cmd)

  return exec(cmd, { cwd })
}
