import * as path from 'path'
import { GameType } from '../types/game.type'

interface GamepathServiceConstructor {
  imports: string
  output: string
  gamePath: string
  flag: string
  mo2Instance: string
  mo2SourcesFolders: string[]
  game: GameType
}

export class UtilsService {
  readonly importFolder: string
  readonly gamePath: string
  readonly output: string
  readonly flag: string
  readonly papyrusCompilerFolder: string
  readonly mo2SourcesFolders: string[]
  readonly mo2Instance: string
  readonly game: GameType

  constructor(private readonly options: GamepathServiceConstructor) {
    this.importFolder = path.join(options.imports)
    this.gamePath = path.join(options.gamePath)
    this.output = path.join(options.output)
    this.flag = options.flag
    this.papyrusCompilerFolder = path.resolve(options.gamePath, 'Papyrus Compiler')
    this.mo2SourcesFolders = options.mo2SourcesFolders
    this.mo2Instance = options.mo2Instance
    this.game = options.game
  }

  public getPapyrusCompilerExecutable() {
    return path.join(this.papyrusCompilerFolder, 'PapyrusCompiler.exe')
  }

  getSourcesFolderType() {
    return this.game === 'Skyrim Special Edition' ? 'Source\\Scripts' : 'Scripts\\Source'
  }

  hasMo2() {
    return !!this.options.mo2Instance
  }
}
