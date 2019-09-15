import { exec } from 'child-process-promise'
import fs from 'fs-extra'
import path from 'path'
import { UtilsService } from './utils.service'

export class CompileService {
  constructor(private readonly utilsService: UtilsService) {}

  public async compile(script: string): Promise<string> {
    const exe = this.utilsService.getPapyrusCompilerExecutable()
    let imports = [this.utilsService.importFolder]
    let output = this.utilsService.output
    const mo2SourcesFolders = this.utilsService.mo2SourcesFolders

    if (this.utilsService.hasMo2() && mo2SourcesFolders && mo2SourcesFolders.length > 0) {
      imports = [...imports, ...mo2SourcesFolders]
      output = path.join(this.utilsService.mo2Instance, 'overwrite', this.utilsService.getSourcesFolderType())

      try {
        await fs.ensureDir(output)
      } catch (e) {
        throw new Error(`Cannot access folder: "${output}". Try running the program as an administrator.`)
      }
    }

    const cmd = `"${exe}" "${script}" -i="${imports.join(';')}" -o="${output}" -f="${this.utilsService.flag}"`

    console.log(`Executing "${cmd}" command`)

    try {
      const result = await exec(cmd, { cwd: this.utilsService.gamePath })

      return result.stdout
    } catch (err) {
      const output = err.stderr.replace('<unknown>', 'unknown')

      if (!output) {
        throw new Error(err.stdout.replace('<unknown>', 'unknown'))
      }

      throw new Error(output)
    }
  }
}
