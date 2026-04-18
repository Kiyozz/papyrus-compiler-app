/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import {
  GameType,
  toExecutable,
  toOtherSource,
  toSource,
} from '#common/game.ts'
import { executeCommand } from '../command/execute'
import { CompilationException } from '../exceptions/compilation.exception'
import { ConfigurationException } from '../exceptions/configuration.exception'
import { Logger } from '../logger'
import * as path from '../path/path'
import { SettingsStore } from '../store/settings/store'
import { generateCompilerCmd } from '../utils/generate-compiler-cmd.util'
import type { ExecException } from '../exceptions/exec.exception'
import { Compiler } from '#main/compilation/compiler.ts'
import { inject } from '#main/inject.ts'
import { Mo2Service } from '#main/mo2/mo2.ts'

interface Runner {
  exe: string
  imports: string[]
  cwd: string
  output: string
}

@inject()
class PapyrusCompilerService implements Compiler {
  #logger = new Logger('PapyrusCompilerService')
  #settingsStore: SettingsStore
  #mo2: Mo2Service

  constructor(settingsStore: SettingsStore, mo2: Mo2Service) {
    this.#settingsStore = settingsStore
    this.#mo2 = mo2
  }

  async compile(scriptName: string): Promise<string> {
    this.#logger.info('compiling', scriptName)

    const { path: gamePath, type: gameType } = this.#settingsStore.get('game')
    const {
      output: outputPath,
      compilerPath,
      flag,
    } = this.#settingsStore.get('compilation')
    const dataFolder = path.join(gamePath, 'Data')
    const gameSource = toSource(gameType)
    const gameSourceAbsolute = path.join(dataFolder, gameSource)
    const mo2Config = this.#settingsStore.get('mo2')
    const runner: Runner = {
      exe: compilerPath,
      imports: [gameSourceAbsolute],
      cwd: gamePath,
      output: path.join(gamePath, outputPath),
    }

    this.#logger.debug('runner', runner)
    const gameExe = toExecutable(gameType)
    const gameExeAbsolute = path.join(gamePath, gameExe)
    this.#logger.debug('game executable', gameExeAbsolute)

    if (!path.exists(compilerPath)) {
      this.#logger.error(
        `the configuration is invalid (compiler), ${compilerPath} file does not exist`,
      )

      throw new ConfigurationException(`${compilerPath} does not exist`)
    }

    if (!path.exists(gameExeAbsolute)) {
      this.#logger.error(
        `the configuration is invalid (game), ${gameExe} file does not exist in game folder`,
      )

      throw new ConfigurationException(`${gameExeAbsolute} does not exist`)
    }

    this.#logger.debug(`ensure ${gameSource} exist`)

    await path.ensureDirs([gameSourceAbsolute])

    const otherSource = toOtherSource(gameType)
    const otherSourceAbsolute = path.join(dataFolder, otherSource)

    this.#logger.debug('other game source', otherSourceAbsolute)

    if (path.exists(otherSourceAbsolute)) {
      this.#logger.debug(`import of the ${otherSource} folder`)

      runner.imports = [otherSourceAbsolute, ...runner.imports]
    }

    if (gameType === GameType.fo4) {
      this.#logger.debug('import of fo4 sources')

      runner.imports = [
        ...(await path.getPathsInFolder(
          [`${gamePath}/Data/Scripts/Source/**`],
          {
            onlyDirectories: true,
            deep: 4,
          },
        )),
        ...runner.imports,
      ]
    }

    if (mo2Config.use) {
      this.#logger.debug('using MO2 support')

      if (!is.undefined(mo2Config.instance)) {
        const imports = await this.#mo2.getImportsPath({
          gameType,
          mo2: {
            instance: mo2Config.instance,
          },
        })

        runner.cwd = this.#mo2.getModsPath(mo2Config.instance)
        runner.output = await this.#mo2.getOutputPath(mo2Config.instance)
        runner.imports = [...runner.imports, ...imports]

        this.#logger.debug('(MO2) final config', runner)
      } else {
        throw new ConfigurationException('missing mo2 instance configuration')
      }
    }

    const cmd = generateCompilerCmd({
      exe: runner.exe,
      scriptName,
      imports: runner.imports,
      output: runner.output,
      flag,
    })

    try {
      const result = await executeCommand(cmd, runner.cwd)

      this.#logger.debug('compilation result', scriptName, result)

      this.#checkCommandResult(scriptName, result)

      return result.stdout.trim()
    } catch (err) {
      if (err instanceof CompilationException) {
        throw err
      }

      if (err instanceof Error) {
        if (err.message.includes('ENAMETOOLONG')) {
          throw new CompilationException(
            scriptName,
            "Cannot compile this script: 'Command line is too long'. You have too many mods source scripts. Try to reduce the number of mods that have psc files. This is a Windows limitation and PCA can't do anything. Refer to https://documentation.pca-dev.app/docs/troubleshooting/command-line-too-long",
          )
        }

        const e = err as ExecException
        this.#logger.error('compilation error', {
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

  #checkCommandResult(
    script: string,
    result: { stdout: string; stderr: string },
  ) {
    const isSuccess = result.stdout.includes('0 failed')

    if (!isSuccess) {
      throw new CompilationException(script, result.stderr)
    }
  }
}

export { PapyrusCompilerService }
