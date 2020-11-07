import is from '@sindresorhus/is'
import appStore from '../../common/appStore'
import { getExecutable, toOtherSource, toSource } from '@common/game'
import CompilerScriptException from '../exceptions/CompilerScriptException'
import InvalidConfigurationException from '../exceptions/InvalidConfigurationException'
import Mo2InvalidConfigurationException from '../exceptions/mo2/Mo2InvalidConfigurationException'
import { executeCommand } from './executeCommand'
import { generateCompilerCmd } from './generateCompilerCmd'
import Log from './Log'
import * as mo2 from './mo2'
import * as path from './path'

interface Runner {
  exe: string
  imports: string[]
  cwd: string
  output: string
}

const log = new Log('Compile')

function checkCommandResult(
  script: string,
  result: { stdout: string; stderr: string }
) {
  const isSuccess = /0 failed/.test(result.stdout)

  if (!isSuccess) {
    throw new CompilerScriptException(script, result.stderr)
  }
}

export async function compile(scriptName: string): Promise<string> {
  log.info('Compile script', scriptName)
  const gamePath = appStore.get('gamePath')
  const gameType = appStore.get('gameType')
  const compilerPath = appStore.get('compilerPath')
  const dataDirectory = path.join(gamePath, 'Data')
  const gameSourcesAbsolute = path.join(dataDirectory, toSource(gameType))
  const mo2Config = appStore.get('mo2')

  const runner: Runner = {
    exe: compilerPath,
    imports: [gameSourcesAbsolute],
    cwd: gamePath,
    output: path.join(gamePath, appStore.get('output'))
  }

  log.info('With config', runner)

  const gameExe = path.join(gamePath, getExecutable(gameType))

  log.info('Game executable is', gameExe)

  if (!(await path.exists(compilerPath))) {
    log.error(
      'Configuration is invalid, papyrus compiler does not exists in game directory'
    )

    throw new InvalidConfigurationException(compilerPath)
  }

  if (!(await path.exists(gameExe))) {
    log.error(
      'Configuration is invalid, game executable does not exists in game directory'
    )

    throw new InvalidConfigurationException(gameExe)
  }

  log.info('Creating game sources folder if not')

  await path.ensureDirs([gameSourcesAbsolute])

  const otherSourceAbsolute = path.join(dataDirectory, toOtherSource(gameType))

  log.debug('Other game source', otherSourceAbsolute)

  const hasOtherGameSource = await path.exists(otherSourceAbsolute)

  if (hasOtherGameSource) {
    log.info('Other game sources found. Importing them')

    runner.imports = [otherSourceAbsolute, ...runner.imports]
  }

  if (mo2Config.instance?.length ?? 0 > 0) {
    log.info('Using MO2 support')

    if (!is.undefined(mo2Config.instance)) {
      const imports = await mo2.generateImports({
        gameType,
        mo2: {
          instance: mo2Config.instance
        }
      })

      runner.cwd = await mo2.generateModsPath(mo2Config.instance)
      runner.output = await mo2.generateOutput(mo2Config.instance)
      runner.imports = [...runner.imports, ...imports]

      log.debug('(MO2) Final config', runner)
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

    log.debug('Compilation result', result)

    checkCommandResult(scriptName, result)

    return result.stdout.trim()
  } catch (err) {
    if (err instanceof CompilerScriptException) {
      throw err
    }

    log.error('Compilation error', { message: err.message, stack: err.stack })

    const outputStdErr = err.stderr.replace('<unknown>', 'unknown')
    const outputStdOut = err.stdout.replace('<unknown>', 'unknown')

    throw new CompilerScriptException(
      scriptName,
      !outputStdErr ? outputStdOut : outputStdErr,
      cmd
    )
  }
}
