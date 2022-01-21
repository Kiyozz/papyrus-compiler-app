/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { toExecutable, toOtherSource, toSource } from '../../common/game'
import { executeCommand } from '../command/execute'
import { CompilationException } from '../exceptions/compilation.exception'
import { ConfigurationException } from '../exceptions/configuration.exception'
import { ExecException } from '../exceptions/exec.exception'
import { Logger } from '../logger'
import * as mo2 from '../mo2/mo2'
import * as path from '../path/path'
import { settingsStore } from '../store/settings/store'
import { generateCompilerCmd } from '../utils/generate-compiler-cmd.util'

type Runner = {
  exe: string
  imports: string[]
  cwd: string
  output: string
}

const logger = new Logger('CompileScript')

function checkCommandResult(
  script: string,
  result: { stdout: string; stderr: string },
) {
  const isSuccess = /0 failed/.test(result.stdout)

  if (!isSuccess) {
    throw new CompilationException(script, result.stderr)
  }
}

export async function compile(scriptName: string): Promise<string> {
  logger.info('compiling', scriptName)

  const { path: gamePath, type: gameType } = settingsStore.get('game')
  const {
    output: outputPath,
    compilerPath,
    flag,
  } = settingsStore.get('compilation')
  const dataFolder = path.join(gamePath, 'Data')
  const gameSource = toSource(gameType)
  const gameSourceAbsolute = path.join(dataFolder, gameSource)
  const mo2Config = settingsStore.get('mo2')
  const runner: Runner = {
    exe: compilerPath,
    imports: [gameSourceAbsolute],
    cwd: gamePath,
    output: path.join(gamePath, outputPath),
  }

  logger.debug('runner', runner)
  const gameExe = toExecutable(gameType)
  const gameExeAbsolute = path.join(gamePath, gameExe)
  logger.debug('game executable', gameExeAbsolute)

  if (!path.exists(compilerPath)) {
    logger.error(
      `the configuration is invalid (compiler), ${compilerPath} file does not exist`,
    )

    throw new ConfigurationException(`${compilerPath} does not exist`)
  }

  if (!path.exists(gameExeAbsolute)) {
    logger.error(
      `the configuration is invalid (game), ${gameExe} file does not exist in game folder`,
    )

    throw new ConfigurationException(`${gameExeAbsolute} does not exist`)
  }

  logger.debug(`ensure ${gameSource} exist`)

  await path.ensureDirs([gameSourceAbsolute])

  const otherSource = toOtherSource(gameType)
  const otherSourceAbsolute = path.join(dataFolder, otherSource)

  logger.debug('other game source', otherSourceAbsolute)

  if (path.exists(otherSourceAbsolute)) {
    logger.debug(`import of the ${otherSource} folder`)

    runner.imports = [otherSourceAbsolute, ...runner.imports]
  }

  if (mo2Config.use) {
    logger.debug('using MO2 support')

    if (!is.undefined(mo2Config.instance)) {
      const imports = await mo2.getImportsPath({
        gameType,
        mo2: {
          instance: mo2Config.instance,
        },
      })

      runner.cwd = mo2.getModsPath(mo2Config.instance)
      runner.output = await mo2.getOutputPath(mo2Config.instance)
      runner.imports = [...runner.imports, ...imports]

      logger.debug('(MO2) final config', runner)
    } else {
      throw new ConfigurationException('missing mo2 instance configuration')
    }
  }

  const cmd = generateCompilerCmd({
    exe: runner.exe,
    scriptName,
    imports: runner.imports,
    output: runner.output,
    flag: flag,
  })

  try {
    const result = await executeCommand(cmd, runner.cwd)

    logger.debug('compilation result', scriptName, result)

    checkCommandResult(scriptName, result)

    return result.stdout.trim()
  } catch (err) {
    if (err instanceof CompilationException) {
      throw err
    }

    if (err instanceof Error) {
      const e = err as ExecException
      logger.error('compilation error', {
        message: e.message,
        stack: e.stack,
      })

      const outputStdErr = e.stderr.replace('<unknown>', 'unknown')
      const outputStdOut = e.stdout.replace('<unknown>', 'unknown')

      throw new CompilationException(
        scriptName,
        !outputStdErr ? outputStdOut : outputStdErr,
      )
    }

    throw err
  }
}
