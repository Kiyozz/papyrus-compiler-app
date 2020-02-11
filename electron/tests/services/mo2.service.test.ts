import { GameHelper } from '../../src/helpers/game.helper'
import { PathHelper } from '../../src/helpers/path.helper'
import { Mo2Service } from '../../src/services/mo2.service'

describe('Mo2Service', () => {
  let pathHelper: PathHelper
  let gameHelper: GameHelper
  let mo2Service: Mo2Service

  beforeEach(() => {
    pathHelper = new PathHelper({} as any)
    gameHelper = new GameHelper()
    mo2Service = new Mo2Service(pathHelper, gameHelper)
  })

  it('should be created', () => expect(mo2Service).toBeTruthy())

  it('should generate a list of import folders with overwrite folders', async () => {
    jest.spyOn(pathHelper, 'ensureDirs')
      .mockImplementation(() => Promise.resolve())

    expect(await mo2Service.generateImports({ game: 'Skyrim Special Edition', mo2Path: 'C:\\MO2', mo2SourcesFolders: ['1. test\\Source\\Scripts'] }))
      .toEqual(
        expect.arrayContaining([
          'C:\\MO2\\overwrite\\Scripts\\Source',
          'C:\\MO2\\overwrite\\Source\\Scripts'
        ])
      )
  })

  it('should generate a list of import folders', async () => {
    jest.spyOn(pathHelper, 'ensureDirs')
      .mockImplementation(() => Promise.resolve())

    const folders = ['1. test\\Source\\Scripts', '2. test\\Source\\Scripts']

    const result = await mo2Service.generateImports({
      game: 'Skyrim Special Edition',
      mo2Path: 'C:\\MO2',
      mo2SourcesFolders: folders
    })

    expect(result.map(r => pathHelper.toAntiSlash(r))).toEqual(
      expect.arrayContaining([
        '1. test\\Source\\Scripts',
        '2. test\\Source\\Scripts'
      ])
    )
  })

  it('should generate the mods path', async () => {
    jest.spyOn(pathHelper, 'exists').mockImplementation(() => Promise.resolve(true))

    const result = await mo2Service.generateModsPath('C:\\MO2')

    expect(pathHelper.toAntiSlash(result)).toBe('C:\\MO2\\mods')
  })

  it('should throws an error when MO2 instance is invalid when generating mods path', async () => {
    jest.spyOn(pathHelper, 'exists').mockImplementation(() => Promise.resolve(false))

    await expect(mo2Service.generateModsPath('C:\\MO2'))
      .rejects
      .toThrow('Folder C:\\MO2\\mods does not exists. Your MO2 Instance is invalid.')
  })

  it('should generate the output folder', async () => {
    jest.spyOn(pathHelper, 'ensureDirs')
      .mockImplementation(() => Promise.resolve())

    expect(await mo2Service.generateOutput('C:\\MO2')).toBe('C:\\MO2\\overwrite\\Scripts')
  })
})
