import { LogService } from '../../src/services/log.service'
import { ShellService } from '../../src/services/shell.service'

jest.mock('electron-log', () => ({
  debug: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}))

describe('ShellService', () => {
  it('should be created', () => {
    expect(new ShellService({} as any)).toBeTruthy()
  })

  it('should exec an command and return the output', async () => {
    const shellService = new ShellService(new LogService())

    const spyOnExec = jest.spyOn((shellService as any), 'exec')
      .mockImplementation(() => Promise.resolve('test'))

    const result = await shellService.execute('testcmd')

    expect(result).toBe('test')
    expect(spyOnExec).toHaveBeenCalledTimes(1)
    expect(spyOnExec).toHaveBeenCalledWith('testcmd', { cwd: undefined })
  })

  it('should exec an command with custom cwd', async () => {
    const shellService = new ShellService(new LogService())

    const spyOnExec = jest.spyOn((shellService as any), 'exec')
      .mockImplementation(() => Promise.resolve('test'))

    const result = await shellService.execute('testcmd', 'cwdtest')

    expect(result).toBe('test')
    expect(spyOnExec).toHaveBeenCalledTimes(1)
    expect(spyOnExec).toHaveBeenCalledWith('testcmd', { cwd: 'cwdtest' })
  })
})
