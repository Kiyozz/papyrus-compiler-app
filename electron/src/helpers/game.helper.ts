import { Injectable } from '@nestjs/common'
import { GameType } from '../types/game.type'

@Injectable()
export default class GameHelper {
  constructor() {}

  toSource(game: GameType): string {
    return game === 'Skyrim Special Edition' ? 'Source/Scripts' : 'Scripts/Source'
  }

  toOtherSource(game: GameType): string {
    return game === 'Skyrim Special Edition' ? 'Scripts/Source' : 'Source/Scripts'
  }
}
