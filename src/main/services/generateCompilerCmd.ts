import Log from './Log'

interface GenerateCmdOptions {
  imports: string[]
  output: string
  exe: string
  scriptName: string
  flag: string
}

const log = new Log('generateCompilerCmd')

export function generateCompilerCmd({ imports, output, exe, scriptName, flag }: GenerateCmdOptions): string {
  const cmd = `"${exe}" "${scriptName}" -i="${imports.join(';')}" -o="${output}" -f="${flag}"`

  log.info('Generated command', cmd)

  return cmd
}
