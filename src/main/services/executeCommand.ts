import { exec as originalExec } from 'child_process'
import { promisify } from 'util'
import Log from './Log'

const exec = promisify(originalExec)
const log = new Log('ExecuteCommand')

export function executeCommand(cmd: string, cwd?: string) {
  log.debug('Executing in directory', cwd, 'Command', cmd)

  return exec(cmd, { cwd })
}
