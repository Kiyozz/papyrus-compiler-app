import { GameHelper } from '../../src/helpers/game.helper'

describe('GameHelper', () => {
  it('should be created', () => {
    expect(new GameHelper()).toBeTruthy()
  })

  it('should get the right executable for SE', () => {
    expect(new GameHelper().getExecutable('Skyrim Special Edition')).toBe('SkyrimSE.exe')
  })

  it('should get the right executable for LE', () => {
    expect(new GameHelper().getExecutable('Skyrim Legendary Edition')).toBe('TESV.exe')
  })

  it('should returns Source/Scripts for SE scripts', () => {
    expect(new GameHelper().toSource('Skyrim Special Edition')).toBe('Source/Scripts')
  })

  it('should returns Scripts/Source for SE other scripts', () => {
    expect(new GameHelper().toOtherSource('Skyrim Special Edition')).toBe('Scripts/Source')
  })

  it('should returns Scripts/Source for LE scripts', () => {
    expect(new GameHelper().toSource('Skyrim Legendary Edition')).toBe('Scripts/Source')
  })

  it('should returns Source/Scripts for LE other scripts', () => {
    expect(new GameHelper().toOtherSource('Skyrim Legendary Edition')).toBe('Source/Scripts')
  })
})
