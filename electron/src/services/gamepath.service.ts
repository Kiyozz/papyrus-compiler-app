import * as path from 'path'

interface GamepathServiceConstructor {
  imports: string
  output: string
  gamePath: string
  flag: string
}

export class GamepathService {
  constructor(private readonly options: GamepathServiceConstructor) {}

  public get importFolder() {
    return path.join(this.options.imports)
  }

  public get gamePath() {
    return this.options.gamePath
  }

  public get output() {
    return this.options.output
  }

  public get flag() {
    return this.options.flag
  }

  public get papyrusCompilerFolder() {
    return path.join(this.gamePath, 'Papyrus Compiler')
  }

  public get papyrusCompilerExecutable() {
    return path.join(this.papyrusCompilerFolder, 'PapyrusCompiler.exe')
  }
}
