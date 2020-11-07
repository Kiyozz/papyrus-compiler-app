import { Logger } from '../Logger'

interface GenerateCmdOptions {
  imports: string[]
  output: string
  exe: string
  scriptName: string
  flag: string
}

const logger = new Logger('generateCompilerCmd')

export function generateCompilerCmd({
  imports,
  output,
  exe,
  scriptName,
  flag
}: GenerateCmdOptions): string {
  const cmd = `"${exe}" "${scriptName}" -i="${imports.join(
    ';'
  )}" -o="${output}" -f="${flag}"`

  logger.debug('Generated command', cmd)

  return cmd
}
