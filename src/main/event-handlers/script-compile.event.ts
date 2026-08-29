/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { Logger } from '../logger'
import { SettingsStore } from '../store/settings/store'
import { ApplicationException } from '../exceptions/application.exception'
import { CompilationException } from '../exceptions/compilation.exception'
import { fromError } from '#common/from-error.ts'
import type { CompilationResult } from '#common/types/compilation-result.ts'
import { inject } from '#main/inject.ts'
import { Compiler } from '#main/compilation/compiler.ts'
import { basename } from '../path/path'

@inject()
export class ScriptCompileEvent {
  readonly #settingsStore: SettingsStore
  readonly #compiler: Compiler
  readonly #logger = new Logger('ScriptCompileEvent')

  constructor(settingsStore: SettingsStore, compiler: Compiler) {
    this.#settingsStore = settingsStore
    this.#compiler = compiler
  }

  private static _cleanSuccessLog(script: string, log: string): string {
    return log
      .replace(
        /Papyrus Compiler Version (?<version>.*) for (?<game>Fallout 4|Skyrim)/,
        '',
      )
      .replace('Starting 1 compile threads for 1 files...', '')
      .replace(`Compiling "${script.replace('.psc', '')}"...`, '')
      .replace(`Compiling "${script}"...`, '')
      .replace(/Copyright (?<text>.*). All rights reserved\.?/, '')
      .replace(`Starting assembly of ${script.replace('.psc', '')}`, '')
      .replace('Assembly succeeded', '')
      .replace('Compilation succeeded.', '')
      .replace('0 error(s), 0 warning(s)', '')
      .replace(
        'Batch compile of 1 files finished. 1 succeeded, 0 failed.',
        'Succeeded',
      )
      .trim()
  }

  private static _cleanErrorLog(script: string, log: string): string {
    return log.replace(`Script ${script} failed to compile: `, '').trim()
  }

  async run(scriptPath: string): Promise<CompilationResult> {
    if (is.undefined(scriptPath)) {
      throw new ApplicationException('script-compile: script is undefined')
    }

    this.#logger.info('start compilation of scripts', scriptPath)
    this.#logger.debug('checking the current store values')

    this.#settingsStore.check()

    this.#logger.debug('current store values checked')

    const scriptName = basename(scriptPath)

    try {
      const { output, name } = await this.#compiler.compile(scriptPath)

      return {
        success: true,
        output: ScriptCompileEvent._cleanSuccessLog(name, output),
        script: scriptName,
      }
    } catch (e) {
      const errorMessage: string = fromError(e).message
      // the compiler logs the namespaced name, not the file name
      const compiledName =
        e instanceof CompilationException ? e.script : scriptName

      return {
        success: false,
        output: ScriptCompileEvent._cleanErrorLog(compiledName, errorMessage),
        script: scriptName,
      }
    }
  }
}
