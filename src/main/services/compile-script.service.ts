/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { appStore } from '../../common/store'
import { getExecutable, toOtherSource, toSource } from '../../common/game'
import { ScriptCompilationException } from '../exceptions/script-compilation.exception'
import { ConfigurationException } from '../exceptions/configuration.exception'
import { Mo2InvalidConfigurationException } from '../exceptions/mo2/mo2-invalid-configuration.exception'
import { generateCompilerCmd } from '../utils/generate-compiler-cmd.util'
import { Logger } from '../logger'
import { executeCommand } from './execute-command.service'
import * as mo2 from './mo2.service'
import * as path from './path.service'

interface Runner {
  exe: string
  imports: string[]
  cwd: string
  output: string
}

const logger = new Logger('CompileScript')

function checkCommandResult(
  script: string,
  result: { stdout: string; stderr: string }
) {
  const isSuccess = /0 failed/.test(result.stdout)

  if (!isSuccess) {
    throw new ScriptCompilationException(script, result.stderr)
  }
}

export async function compileScript(scriptName: string): Promise<string> {
  logger.debug('compiling the file', scriptName)
  const gamePath = appStore.get('gamePath')
  const gameType = appStore.get('gameType')
  const compilerPath = appStore.get('compilerPath')
  const dataFolder = path.join(gamePath, 'Data')
  const gameSource = toSource(gameType)
  const gameSourceAbsolute = path.join(dataFolder, gameSource)
  const mo2Config = appStore.get('mo2')
  const runner: Runner = {
    exe: compilerPath,
    imports: [gameSourceAbsolute],
    cwd: gamePath,
    output: path.join(gamePath, appStore.get('output'))
  }

  logger.debug('runner', runner)
  const gameExe = getExecutable(gameType)
  const gameExeAbsolute = path.join(gamePath, gameExe)
  logger.debug('game executable', gameExeAbsolute)

  if (!(await path.exists(compilerPath))) {
    logger.error(
      'the configuration is invalid, PapyrusCompiler.exe file does not exist in game folder'
    )

    throw new ConfigurationException(compilerPath)
  }

  if (!(await path.exists(gameExeAbsolute))) {
    logger.error(
      `the configuration is invalid, ${gameExe} file does not exist in game folder`
    )

    throw new ConfigurationException(gameExeAbsolute)
  }

  logger.debug(`creation of folder ${gameSource} if it does not exist`)

  await path.ensureDirs([gameSourceAbsolute])

  const otherSource = toOtherSource(gameType)
  const otherSourceAbsolute = path.join(dataFolder, otherSource)

  logger.debug('other game source', otherSourceAbsolute)

  if (await path.exists(otherSourceAbsolute)) {
    logger.debug(`import of the ${otherSource} folder`)

    runner.imports = [otherSourceAbsolute, ...runner.imports]
  }

  if (mo2Config.instance?.length ?? 0 > 0) {
    logger.debug('using MO2 support')

    if (!is.undefined(mo2Config.instance)) {
      const imports = await mo2.getImportsPath({
        gameType,
        mo2: {
          instance: mo2Config.instance
        }
      })

      runner.cwd = await mo2.getModsPath(mo2Config.instance)
      runner.output = await mo2.getOutputPath(mo2Config.instance)
      runner.imports = [...runner.imports, ...imports]

      logger.debug('(MO2) final config', runner)
    } else {
      throw new Mo2InvalidConfigurationException(['instance', 'sources'])
    }
  }

  const cmd = generateCompilerCmd({
    exe: runner.exe,
    scriptName,
    imports: runner.imports,
    output: runner.output,
    flag: appStore.get('flag')
  })

  try {
    const result = await executeCommand(cmd, runner.cwd)

    logger.debug('compilation result', result)

    checkCommandResult(scriptName, result)

    return result.stdout.trim()
  } catch (err) {
    if (err instanceof ScriptCompilationException) {
      throw err
    }

    logger.error('compilation error', {
      message: err.message,
      stack: err.stack
    })

    const outputStdErr = err.stderr.replace('<unknown>', 'unknown')
    const outputStdOut = err.stdout.replace('<unknown>', 'unknown')

    throw new ScriptCompilationException(
      scriptName,
      !outputStdErr ? outputStdOut : outputStdErr,
      cmd
    )
  }
}
