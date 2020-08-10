import { exec as originalExec } from 'child_process'
import { promisify } from 'util'
import { LogService } from './log.service'

const exec = promisify(originalExec)

export class ShellService {
  constructor(private readonly logService: LogService) {}

  execute(cmd: string, cwd?: string) {
    this.logService.debug('Executing in directory', cwd, 'Command', cmd)

    return exec(cmd, { cwd })
  }
}
