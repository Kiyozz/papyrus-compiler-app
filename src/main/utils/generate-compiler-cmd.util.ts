/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Logger } from '../logger'

type GenerateCmdOptions = {
  imports: string[]
  output: string
  exe: string
  scriptName: string
  flag: string
}

const logger = new Logger('GenerateCompilerCmd')

export function generateCompilerCmd({
  imports,
  output,
  exe,
  scriptName,
  flag,
}: GenerateCmdOptions): string {
  const cmd = `"${exe}" "${scriptName}" -i="${imports.join(
    ';',
  )}" -o="${output}" -f="${flag}"`

  logger.debug('generated command', cmd)

  return cmd
}
