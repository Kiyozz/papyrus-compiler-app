import { exec } from 'child-process-promise'
import fs from 'fs-extra'
import log from 'electron-log'
import path from 'path'
import PathHelper from '../helpers/path.helper'
import { UtilsService } from './utils.service'

export class CompileService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly pathHelper: PathHelper
  ) {}

  public async compile(script: string): Promise<string> {
    let exe = this.utilsService.papyrusCompilerExecutableRelative
    let imports = [this.utilsService.importFolder]
    const hasOtherGameSource = await fs.pathExists(this.utilsService.otherGameSourceFolder)

    if (hasOtherGameSource) {
      imports = [this.utilsService.otherGameSourceFolder, ...imports]
    }

    let output = this.utilsService.output
    let cwd = this.utilsService.gamePath
    const mo2SourcesFolders = this.utilsService.mo2SourcesFolders
    const mo2modsPath = this.pathHelper.join(this.utilsService.mo2Instance, 'mods')

    if (this.utilsService.hasMo2() && mo2SourcesFolders && mo2SourcesFolders.length > 0) {
      imports = [
        ...imports,
        ...mo2SourcesFolders
          .map(folder => folder.replace(mo2modsPath, ''))
          .map(folder => `.\\${folder}`),
        path.join('..', 'overwrite', this.utilsService.sourcesFolderType)
      ]
      output = path.join(this.utilsService.mo2Instance, 'overwrite\\Scripts')
      cwd = mo2modsPath
      exe = this.utilsService.papyrusCompilerExecutableAbsolute

      try {
        await fs.ensureDir(output)
      } catch (e) {
        throw new Error(`Cannot access folder: "${output}". Try running the program as an administrator.`)
      }
    }

    const cmd = `"${exe}" "${script}" -i="${imports.join(';')}" -o="${output}" -f="${this.utilsService.flag}"`

    log.debug(`Executing in "${cwd}" directory. Command ${cmd}`)

    const last = imports.map(imp => this.pathHelper.basename(imp) === script).lastIndexOf(true)
    const lastFileName = imports[last]
    const backupFile = await fs.readFile(lastFileName)

    try {
      const result = await exec(cmd, { cwd })

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
}
