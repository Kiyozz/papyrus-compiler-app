import { Games } from '../enums/games.enum'

export class GameService {
  toExecutable(game: Games): string {
    return game === Games.SE ? 'SkyrimSE.exe' : 'TESV.exe'
  }
}
