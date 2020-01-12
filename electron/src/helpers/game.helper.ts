import { Injectable } from '@nestjs/common'
import { GameType } from '../types/game.type'

@Injectable()
export class GameHelper {
  constructor() {}

  toSource(game: GameType): string {
    return game === 'Skyrim Special Edition' ? 'Source/Scripts' : 'Scripts/Source'
  }

  toOtherSource(game: GameType): string {
    return game === 'Skyrim Special Edition' ? 'Scripts/Source' : 'Source/Scripts'
  }

  getExecutable(game: GameType): string {
    return game === 'Skyrim Special Edition' ? 'SkyrimSE.exe' : 'TESV.exe'
  }
}
