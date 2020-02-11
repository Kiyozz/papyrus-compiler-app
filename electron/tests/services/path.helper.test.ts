import path from 'path'
import fs from 'fs-extra'
import { PathHelper } from '../../src/helpers/path.helper'
import { LogService } from '../../src/services/log.service'

jest.mock('electron-log', () => ({
  debug: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}))

interface MockHelperPropertyOptions {
  once?: boolean
  accessType?: string
}

function mockHelperProperty(helper: PathHelper, property: string, method: string, callback: (...args: any[]) => any, options?: MockHelperPropertyOptions) {
  const spy = jest.spyOn((helper as any)[property], method, (options?.accessType) as any)

  if (options?.once) {
    spy.mockImplementationOnce(callback)
  } else {
    spy.mockImplementation(callback)
  }
}

describe('PathHelper', () => {
  let helper: PathHelper
  let logService: LogService

  beforeEach(() => {
    logService = new LogService()
    helper = new PathHelper(logService)
  })

  it('should create the helper', () => {
    expect(helper).toBeTruthy()
  })

  it('should convert anti-slash to slash', () => {
    expect(helper.toSlash('C:\\Program Files')).toBe('C:/Program Files')
  })

  it('should convert slash to anti-slash', () => {
    expect(helper.toAntiSlash('C:/Program Files')).toBe('C:\\Program Files')
  })

  it('should convert slash to anti-slash even the path contains an anti-slash', () => {
    expect(helper.toAntiSlash('C:/Program Files\\Skyrim')).toBe('C:\\Program Files\\Skyrim')
  })

  it('should join the paths', () => {
    const expected = 'C:\\Program Files/Skyrim/mods'.replace(/\//g, path.sep)

    expect(helper.join('C:\\Program Files', 'Skyrim', 'mods')).toBe(expected)
  })

  it('should give basename of a path', () => {
    expect(helper.basename('C:\\Program Files\\Skyrim\\TESV.exe')).toBe('TESV.exe')
  })

  it('should say the path exists', async () => {
    mockHelperProperty(helper, 'fs', 'pathExists', () => Promise.resolve(true))

    expect(await helper.exists('My File')).toBe(true)
  })

  it('should throws an error if readed file does not exists', async () => {
    jest.spyOn(helper, 'exists')
      .mockImplementation(() => Promise.resolve(false))

    await expect(helper.readFile('My file')).rejects.toThrow('File My file does not exists.')
  })

  it('should throws an error if fs.readFile failed', async () => {
    mockHelperProperty(helper, 'fs', 'readFile', (file: string) => {
      throw new Error(`Cannot read from file ${file}`)
    })

    await expect(helper.readFile('My file')).rejects.toThrow('Cannot read file "My file". Cannot read from file My file')
  })

  it('should read a file', async () => {
    mockHelperProperty(helper, 'fs', 'readFile', () => Promise.resolve(Buffer.from('test file')))

    const result = await helper.readFile('My file')

    expect(result.toString()).toBe('test file')
  })

  it('should throws an error when cannot write a file', async () => {
    mockHelperProperty(helper, 'fs', 'writeFile', (file: string) => {
      throw new Error(`Cannot write file ${file}`)
    })

    await expect(helper.writeFile('My file', '')).rejects.toThrow('Cannot write to file "My file". Cannot write file My file')
  })

  it('should throws an error when writing a file that does not exists', async () => {
    jest.spyOn(helper, 'exists')
      .mockImplementation(() => Promise.resolve(false))

    await expect(helper.writeFile('My file', '')).rejects.toThrow('File My file does not exists.')
  })

  it('should write a file', async () => {
    mockHelperProperty(helper, 'fs', 'writeFile', () => undefined)

    await expect(helper.writeFile('My file', '')).resolves.toBeUndefined()
  })

  it('should returns a empty list of folders', async () => {
    jest.spyOn((helper as any), 'fg')
      .mockImplementation(() => Promise.resolve([]))

    expect(await helper.getPathsInFolder([], {})).toHaveLength(0)
  })

  it('should returns a list of one folder', async () => {
    jest.spyOn((helper as any), 'fg')
      .mockImplementation(() => Promise.resolve(['C:\\fr.exe']))

    const result = await helper.getPathsInFolder(['**/fr.exe'], {})

    expect(result).toHaveLength(1)
    expect(result[0]).toBe('C:\\fr.exe')
  })

  it('should throws an error if cannot ensureDirs', async () => {
    mockHelperProperty(helper, 'fs', 'ensureDir', () => {
      throw new Error('An error')
    })

    await expect(helper.ensureDirs(['My folder'])).rejects.toThrow('File "My folder" seems to not exists or cannot be created.')
  })

  it('should throws an error if cannot ensureDirs', async () => {
    mockHelperProperty(helper, 'fs', 'ensureDir', () => {
      throw new Error('An error')
    })

    await expect(helper.ensureDirs(['My folder'])).rejects.toThrow('File "My folder" seems to not exists or cannot be created.')
  })

  it('should throws an error if cannot ensureDirs at the second folder', async () => {
    mockHelperProperty(helper, 'fs', 'ensureDir', () => undefined, { once: true })
    mockHelperProperty(helper, 'fs', 'ensureDir', () => {
      throw new Error('An error')
    }, { once: true })

    await expect(helper.ensureDirs(['My folder', 'My second folder'])).rejects.toThrow('File "My second folder" seems to not exists or cannot be created.')
  })

  it('should give no errors to ensureDirs two folders', async () => {
    mockHelperProperty(helper, 'fs', 'ensureDir', () => undefined, { once: true })
    mockHelperProperty(helper, 'fs', 'ensureDir', () => undefined, { once: true })

    expect(await helper.ensureDirs(['My folder', 'My second folder'])).toBeUndefined()
  })

  it('should throws an error if cannot get stat of a file', async () => {
    mockHelperProperty(helper, 'fs', 'stat', () => {
      throw new Error('An error')
    })

    await expect(helper.stat('My file')).rejects.toThrow('Cannot access file "My file".')
  })

  it('should returns the separator', () => {
    Object.defineProperty((helper as any).path, 'sep', { value: '/', configurable: false })

    expect(helper.separator).toBe('/')
  })
})
