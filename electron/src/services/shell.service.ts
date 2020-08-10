import { exec } from 'child_process'
import { promisify } from 'util'
import { LogService } from './log.service'

export class ShellService {
  private exec = promisify(exec)

  constructor(private readonly logService: LogService) {}

  execute(cmd: string, cwd?: string) {
    this.logService.debug('Executing in directory', cwd, 'Command', cmd)

    return this.exec(cmd, { cwd })
  }
}
