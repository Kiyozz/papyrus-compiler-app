import { GameHelper } from '../../src/helpers/game.helper'
import { PathHelper } from '../../src/helpers/path.helper'
import { ConfigService } from '../../src/services/config.service'

describe('ConfigService', () => {
  let service: ConfigService
  let pathHelper: PathHelper
  let gameHelper: GameHelper

  beforeEach(() => {
    pathHelper = new PathHelper({} as any)
    gameHelper = new GameHelper()
  })

  describe('Creation', () => {
    it('should create the service', () => {
      service = new ConfigService({
        flag: '',
        game: 'Skyrim Special Edition',
        gamePath: 'C:\\Program Files\\Skyrim',
        gameSourcesFolder: '',
        gameSourcesType: '',
        mo2InstanceFolder: '',
        mo2SourcesFolders: [],
        otherGameSourcesFolder: '',
        output: ''
      })

      expect(service).toBeTruthy()
    })

    it('should create the service with ::create()', () => {
      const service = ConfigService.create(
        new PathHelper({ } as any),
        new GameHelper(),
        {
          gamePath: 'C:\\Program Files\\Skyrim',
          game: 'Skyrim Special Edition',
          mo2InstanceFolder: '',
          mo2SourcesFolders: []
        }
      )

      expect(service).toBeTruthy()
    })
  })

  describe('Features', () => {
    beforeEach(() => {
      service = ConfigService.create(
        pathHelper,
        gameHelper,
        {
          game: 'Skyrim Special Edition',
          gamePath: 'C:\\Program Files\\Skyrim',
          mo2SourcesFolders: [],
          mo2InstanceFolder: ''
        }
      )
    })

    it('should return the right papyrus compiler folder', () => {
      expect(service.papyrusCompilerExecutableAbsolute).toBe('C:\\Program Files\\Skyrim\\Papyrus Compiler\\PapyrusCompiler.exe')
      expect(service.papyrusCompilerExecutableRelative).toBe('.\\Papyrus Compiler\\PapyrusCompiler.exe')
    })

    it('should have mo2', () => {
      service = ConfigService.create(
        pathHelper,
        gameHelper,
        {
          game: 'Skyrim Special Edition',
          gamePath: '',
          mo2SourcesFolders: [
            'C:\\mods\\'
          ],
          mo2InstanceFolder: 'C:\\'
        }
      )
    })

    it('should not have mo2 if no mo2 instance folder', () => {
      service = ConfigService.create(
        pathHelper,
        gameHelper,
        {
          game: 'Skyrim Special Edition',
          gamePath: '',
          mo2InstanceFolder: '',
          mo2SourcesFolders: ['1. fr\\Source\\Scripts']
        }
      )

      expect(service.hasMo2()).toBe(false)
    })

    it('should not have mo2 if mo2 instance has no valid mods folder', () => {
      service = ConfigService.create(
        pathHelper,
        gameHelper,
        {
          game: 'Skyrim Special Edition',
          gamePath: '',
          mo2InstanceFolder: 'C:\\',
          mo2SourcesFolders: []
        }
      )

      expect(service.hasMo2()).toBe(false)
    })
  })
})
