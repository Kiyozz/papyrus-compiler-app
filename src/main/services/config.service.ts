import * as path from 'path'
import { toOtherSource, toSource } from '../helpers/game.helper'
import { PathHelper } from '../helpers/path.helper'
import { GameType } from '../types/game.type'

interface GamepathServiceConstructor {
  gameSourcesFolder: string
  output: string
  gamePath: string
  flag: string
  mo2InstanceFolder: string
  mo2SourcesFolders: string[]
  game: GameType
  gameSourcesType: string
  otherGameSourcesFolder: string
}

export class ConfigService {
  readonly gameSourcesFolder: string
  readonly gamePath: string
  readonly output: string
  readonly flag: string
  readonly papyrusCompilerFolder: string
  readonly mo2SourcesFolders: string[]
  readonly mo2InstanceFolder: string
  readonly game: GameType
  readonly gameSourcesType: string
  readonly otherGameSourcesFolder: string

  constructor(private readonly options: GamepathServiceConstructor) {
    this.gameSourcesFolder = path.join(options.gameSourcesFolder)
    this.gamePath = path.join(options.gamePath)
    this.output = path.join(options.output)
    this.flag = options.flag
    this.papyrusCompilerFolder = 'Papyrus Compiler'
    this.mo2SourcesFolders = options.mo2SourcesFolders
    this.mo2InstanceFolder = options.mo2InstanceFolder
    this.game = options.game
    this.gameSourcesType = options.gameSourcesType
    this.otherGameSourcesFolder = options.otherGameSourcesFolder
  }

  get papyrusCompilerExecutableRelative() {
    return `.${path.sep}${this.papyrusCompilerFolder}${path.sep}PapyrusCompiler.exe`
  }

  get papyrusCompilerExecutableAbsolute() {
    return path.join(this.gamePath, this.papyrusCompilerExecutableRelative)
  }

  hasMo2() {
    return !!this.options.mo2InstanceFolder && this.mo2SourcesFolders?.length > 0
  }

  static create(
    pathHelper: PathHelper,
    { game, gamePath, mo2SourcesFolders, mo2InstanceFolder }: { game: GameType; gamePath: string; mo2SourcesFolders: string[]; mo2InstanceFolder: string }
  ) {
    const gameSourcesType = toSource(game)
    const pathToCheckGameSourceFolder = toOtherSource(game)
    const gameSourcesFolder = pathHelper.join(gamePath, 'Data', gameSourcesType)
    const otherGameSourcesFolder = pathHelper.join(gamePath, 'Data', pathToCheckGameSourceFolder)
    const output = pathHelper.join(gamePath, 'Data\\Scripts')

    return new ConfigService({
      flag: 'TESV_Papyrus_Flags.flg',
      gamePath,
      game,
      gameSourcesFolder,
      otherGameSourcesFolder,
      gameSourcesType,
      output,
      mo2InstanceFolder,
      mo2SourcesFolders
    })
  }
}
