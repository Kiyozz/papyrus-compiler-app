/*
 * 2022-2026 Kiyozz.
 */

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
import type { CompileResult } from '#main/compilation/compiler.ts'
import { inject } from '#main/inject.ts'
import { toSlash } from '../slash'
import { resolveScript } from '../utils/script-namespace.util'

const uniqImports = (imports: string[]): string[] => [
  ...new Map(imports.map((i) => [toSlash(i).toLowerCase(), i])).values(),
]

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

  constructor(settingsStore: SettingsStore) {
    this.#settingsStore = settingsStore
  }

  async compile(scriptPath: string): Promise<CompileResult> {
    this.#logger.info('compiling', scriptPath)

    const { path: gamePath, type: gameType } = this.#settingsStore.get('game')
    const {
      output: outputPath,
      compilerPath,
      flag,
    } = this.#settingsStore.get('compilation')
    const { name: scriptName, importDir } = await resolveScript(
      scriptPath,
      gameType,
    )
    const dataFolder = path.join(gamePath, 'Data')
    const gameSource = toSource(gameType)
    const gameSourceAbsolute = path.join(dataFolder, gameSource)
    const resolvedOutput =
      outputPath.trim() === ''
        ? path.join(gamePath, 'Data/Scripts')
        : outputPath
    const runner: Runner = {
      exe: compilerPath,
      imports: [gameSourceAbsolute, importDir],
      cwd: gamePath,
      output: resolvedOutput,
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

    await path.ensureDirs([gameSourceAbsolute, runner.output])

    if (gameType === GameType.sf) {
      // sf keeps every script under Scripts/Source, with no Base nor User
      // folder: its subfolders are namespaces, so that is the only root.
      this.#logger.debug('import of the sf source root')

      runner.imports = [importDir, gameSourceAbsolute].filter((i) =>
        path.exists(i),
      )
    } else if (gameType === GameType.fo4) {
      // fo4 kept the le layout (Scripts/Source) and turned its subfolders into
      // namespaces, so only Source, Source/Base and Source/User are roots: the
      // compiler walks down to the namespace folders on its own.
      this.#logger.debug('import of fo4 source roots')

      runner.imports = [
        importDir,
        gameSourceAbsolute,
        path.join(gameSourceAbsolute, 'Base'),
        path.join(gameSourceAbsolute, 'User'),
      ].filter((i) => path.exists(i))
    } else {
      const otherSource = toOtherSource(gameType)
      const otherSourceAbsolute = path.join(dataFolder, otherSource)

      this.#logger.debug('other game source', otherSourceAbsolute)

      if (path.exists(otherSourceAbsolute)) {
        this.#logger.debug(`import of the ${otherSource} folder`)

        runner.imports = [importDir, otherSourceAbsolute, gameSourceAbsolute]
      }
    }

    runner.imports = uniqImports(runner.imports)

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

      return { output: result.stdout.trim(), name: scriptName }
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
