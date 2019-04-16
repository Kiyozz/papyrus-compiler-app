import { GamepathService } from './gamepath.service'
import { exec } from 'child-process-promise'

export class CompileService {
  constructor(private readonly gamePathService: GamepathService) {}

  public async compile(script: string): Promise<string> {
    const exe = this.gamePathService.papyrusCompilerExecutable
    const cmd = `"${exe}" ${script} -i="${this.gamePathService.importFolder}" -o="${this.gamePathService.output}" -f="${this.gamePathService.flag}"`

    try {
      const result = await exec(cmd, { cwd: this.gamePathService.gamePath })

      return result.stdout
    } catch (err) {
      throw new Error(err.stderr.replace('<unknown>', 'unknown'))
    }
  }
}
