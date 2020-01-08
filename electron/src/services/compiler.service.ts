import { exec } from 'child-process-promise'
import fs from 'fs-extra'
import log from 'electron-log'
import path from 'path'
import PathHelper from '../helpers/path.helper'
import { ConfigService } from './config.service'

export class CompilerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly pathHelper: PathHelper
  ) {}

  async compile(script: string): Promise<string> {
    const runner = {
      exe: this.configService.papyrusCompilerExecutableRelative,
      imports: [this.configService.importFolder],
      cwd: this.configService.gamePath,
      output: this.configService.output
    }
    const hasOtherGameSource = await this.pathHelper.exists(this.configService.otherGameSourceFolder)

    await this.ensureDir(this.configService.importFolder)

    if (hasOtherGameSource) {
      runner.imports = [this.configService.otherGameSourceFolder, ...runner.imports]
    }

    const { mo2SourcesFolders } = this.configService
    const mo2modsPath = this.pathHelper.join(this.configService.mo2Instance, 'mods')

    if (this.configService.hasMo2() && mo2SourcesFolders && mo2SourcesFolders.length > 0) {
      const mo2OverwriteImports = path.join('..', 'overwrite', this.configService.sourcesFolderType)

      runner.imports = [
        ...runner.imports,
        ...mo2SourcesFolders
          .map(folder => folder.replace(mo2modsPath, ''))
          .map(folder => `.\\${folder}`),
        mo2OverwriteImports
      ]
      runner.output = path.join(this.configService.mo2Instance, 'overwrite\\Scripts')
      runner.cwd = mo2modsPath
      runner.exe = this.configService.papyrusCompilerExecutableAbsolute

      await this.ensureDir(this.pathHelper.join(mo2modsPath, mo2OverwriteImports))
      await this.ensureDir(runner.output)
    }

    const cmd = `"${runner.exe}" "${script}" -i="${runner.imports.join(';')}" -o="${runner.output}" -f="${this.configService.flag}"`

    log.debug(`Executing in "${runner.cwd}" directory. Command ${cmd}`)

    const last = runner.imports.map(imp => this.pathHelper.basename(imp) === script).lastIndexOf(true)
    const lastFileName = runner.imports[last]
    const backupFile = await fs.readFile(lastFileName)

    try {
      const result = await exec(cmd, { cwd: runner.cwd })

      return result.stdout
    } catch (err) {
      await fs.writeFile(lastFileName, backupFile)

      const output = err.stderr.replace('<unknown>', 'unknown')

      if (!output) {
        throw new Error(err.stdout.replace('<unknown>', 'unknown'))
      }

      throw new Error(output)
    }
  }

  private async ensureDir(dir: string): Promise<void> {
    try {
      await fs.ensureDir(dir)
    } catch (e) {
      throw new Error(`Cannot access folder: "${dir}". Try running the program as an administrator.`)
    }
  }
}
