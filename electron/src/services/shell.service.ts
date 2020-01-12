import { exec } from 'child-process-promise'
import { Injectable } from '@nestjs/common'
import { LogService } from './log.service'

@Injectable()
export class ShellService {
  constructor(
    private readonly logService: LogService
  ) {}

  execute(cmd: string, cwd?: string) {
    this.logService.debug('Executing in directory', cwd, 'Command', cmd)

    return exec(cmd, { cwd })
  }
}
