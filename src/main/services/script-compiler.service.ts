import { CompileScriptException, InvalidConfigurationException } from '../exceptions'
import { getExecutable } from '../helpers/game.helper'
import { PathHelper } from '../helpers/path.helper'
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
    private readonly pathHelper: PathHelper,
    private readonly shellService: ShellService,
    private readonly papyrusCompilerService: PapyrusCompilerService,
    private readonly mo2Service: Mo2Service,
    private readonly logService: LogService
  ) {}

  async compile(scriptName: string): Promise<string> {
    const runner: Runner = {
      exe: this.configService.papyrusCompilerExecutableRelative,
      imports: [this.configService.gameSourcesFolder],
      cwd: this.configService.gamePath,
      output: this.configService.output
    }

    this.logService.info('Runner config', runner)

    const gameExe = this.pathHelper.join(this.configService.gamePath, getExecutable(this.configService.game))

    this.logService.info('Game executable is', gameExe)

    if (!(await this.pathHelper.exists(this.configService.papyrusCompilerExecutableAbsolute))) {
      this.logService.error('Configuration is invalid, papyrus compiler does not exists in game directory')

      throw new InvalidConfigurationException(this.configService.gamePath, this.configService.papyrusCompilerExecutableAbsolute)
    }

    if (!(await this.pathHelper.exists(gameExe))) {
      this.logService.error('Configuration is invalid, game executable does not exists in game directory')

      throw new InvalidConfigurationException(this.configService.gamePath, gameExe)
    }

    this.logService.debug('Other game source', this.configService.otherGameSourcesFolder)

    console.log(this.configService.otherGameSourcesFolder)

    const hasOtherGameSource = await this.pathHelper.exists(this.configService.otherGameSourcesFolder)

    this.logService.info('Creating game sources folder if not')

    await this.ensureDir([this.configService.gameSourcesFolder])

    if (hasOtherGameSource) {
      this.logService.info('Other game sources found. Importing them')

      runner.imports = [this.configService.otherGameSourcesFolder, ...runner.imports]
    }

    if (this.configService.hasMo2()) {
      this.logService.info('Using MO2 support')

      const imports = await this.mo2Service.generateImports({
        game: this.configService.game,
        mo2Path: this.configService.mo2InstanceFolder,
        mo2SourcesFolders: this.configService.mo2SourcesFolders
      })
      const output = await this.mo2Service.generateOutput(this.configService.mo2InstanceFolder)

      runner.exe = this.configService.papyrusCompilerExecutableAbsolute
      runner.cwd = await this.mo2Service.generateModsPath(this.configService.mo2InstanceFolder)
      runner.output = output
      runner.imports = [...runner.imports, ...imports]

      this.logService.debug('New runner config', runner)
    }

    const cmd = this.papyrusCompilerService.generateCmd({
      exe: runner.exe,
      scriptName,
      imports: runner.imports,
      output: runner.output,
      flag: this.configService.flag
    })

    try {
      const result = await this.shellService.execute(cmd, runner.cwd)

      this.logService.info('COMPILATION RESULT', result)

      return result.stdout
    } catch (err) {
      this.logService.error('ERROR COMPILATION', err)
      const output = err.stderr.replace('<unknown>', 'unknown')

      throw new CompileScriptException(scriptName, !output ? err.stdout.replace('<unknown>', 'unknown') : output, cmd)
    }
  }

  private async ensureDir(dirs: string[]): Promise<void> {
    await this.pathHelper.ensureDirs(dirs)
  }
}
