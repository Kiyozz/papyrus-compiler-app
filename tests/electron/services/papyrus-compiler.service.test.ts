import { PapyrusCompilerService } from '../../../electron/src/services/papyrus-compiler.service'

describe('PapyrusCompilerService', () => {
  it('should be created', () => {
    expect(new PapyrusCompilerService()).toBeTruthy()
  })

  it('should generate the cmd', () => {
    const papyrusCompilerService = new PapyrusCompilerService()

    const result = papyrusCompilerService.generateCmd({
      scriptName: 'test.psc',
      output: 'C:\\MO2',
      imports: [],
      exe: 'Papyrus.exe',
      flag: 'FLAG'
    })

    expect(result).toBe('"Papyrus.exe" "test.psc" -i="" -o="C:\\MO2" -f="FLAG"')
  })
})
