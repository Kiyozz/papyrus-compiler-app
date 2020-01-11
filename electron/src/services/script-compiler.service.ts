import { CompileScriptException } from '../exceptions/compiler/compile-script.exception'
import { InvalidConfigurationException } from '../exceptions/configuration/invalid-configuration.exception'
import GameHelper from '../helpers/game.helper'
import PathHelper from '../helpers/path.helper'
import { ConfigService } from './config.service'
import { LogService } from './log.service'
import { Mo2Service } from './mo2.service'
import { PapyrusCompilerService } from './papyrus-compiler.service'
import { ShellService } from './shell.service'

interface Runner {
  exe: string
  imports: string[]
  cwd: string
  output: string
}

export class ScriptCompilerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly gameHelper: GameHelper,
    private readonly pathHelper: PathHelper,
    private readonly shellService: ShellService,
    private readonly papyrusCompilerService: PapyrusCompilerService,
    private readonly mo2Service: Mo2Service,
    private readonly logService: LogService
  ) {}

  async compile(scriptName: string): Promise<string> {
    const runner: Runner = {
      exe: this.configService.papyrusCompilerExecutableRelative,
      imports: [this.configService.importFolder],
      cwd: this.configService.gamePath,
      output: this.configService.output
    }

    const gameExe = this.gameHelper.getExecutable(this.configService.game)

    this.logService.debug('Game executable is', gameExe)

    if (!(await this.pathHelper.exists(gameExe))) {
      throw new InvalidConfigurationException(this.configService.gamePath, gameExe)
    }

    const hasOtherGameSource = await this.pathHelper.exists(this.configService.otherGameSourceFolder)

    await this.ensureDir([this.configService.importFolder])

    if (hasOtherGameSource) {
      runner.imports = [this.configService.otherGameSourceFolder, ...runner.imports]
    }

    if (this.configService.hasMo2()) {
      const imports = await this.mo2Service.generateImports({
        game: this.configService.game,
        mo2Path: this.configService.mo2Instance,
        mo2SourcesFolders: this.configService.mo2SourcesFolders
      })
      const output = await this.mo2Service.generateOutput(this.configService.mo2Instance)

      runner.exe = this.configService.papyrusCompilerExecutableAbsolute
      runner.cwd = await this.mo2Service.generateModsPath(this.configService.mo2Instance)
      runner.output = output
      runner.imports = [
        ...runner.imports,
        ...imports
      ]

      await this.ensureDir([...imports, output])
    }

    const cmd = this.papyrusCompilerService.generateCmd({ exe: runner.exe, scriptName, imports: runner.imports, output: runner.output, flag: this.configService.flag })

    try {
      const result = await this.shellService.execute(cmd, runner.cwd)

      return result.stdout
    } catch (err) {
      const output = err.stderr.replace('<unknown>', 'unknown')

      if (!output) {
        throw new CompileScriptException(scriptName, err.stdout.replace('<unknown>', 'unknown'), cmd)
      }

      throw new CompileScriptException(scriptName, output, cmd)
    }
  }

  private async ensureDir(dirs: string[]): Promise<void> {
    await this.pathHelper.ensureDirs(dirs)
  }
}
