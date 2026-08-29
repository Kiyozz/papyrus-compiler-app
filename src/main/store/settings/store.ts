/*
 * 2022-2026 Kiyozz.
 */

import * as fs from 'node:fs'
import { app } from 'electron'
import Store from 'electron-store'
import { isDev } from 'electron-util/main'
import osLocale from 'os-locale'
import {
  type Flag,
  type GamePath,
  GameType,
  toFlag,
  validateGame,
} from '#common/game.ts'
import { LogLevel } from '#common/log-level.ts'
import { Theme } from '#common/theme.ts'
import { type CliArgs, cliArgs } from '../../cli-args'
import { EnvO } from '../../env'
import { dirname, join } from '../../path/path'
import { migrate410 } from './migrations/4.1.0.migration'
import { migrate420 } from './migrations/4.2.0.migration'
import { migrate510 } from './migrations/5.1.0.migration'
import { migrate520 } from './migrations/5.2.0.migration'
import { migrate550 } from './migrations/5.5.0.migration'
import { migrate560 } from './migrations/5.6.0.migration'
import { migrate590 } from './migrations/5.9.0.migration'
import type { Config } from '#common/types/config.ts'
import { inject } from '#main/inject.ts'
import is from '@sindresorhus/is'
import { Logger } from '#main/logger.ts'
import { DEFAULT_COMPILER_PATH } from '#main/constants.ts'
import { validateGroup } from '#main/validators/group.validator.ts'

const jsonPath = isDev
  ? join(dirname(import.meta), '../../../..', 'package.json')
  : join(app.getAppPath(), 'package.json')
const json = JSON.parse(fs.readFileSync(jsonPath).toString()) as {
  version: string
}

const defaultSettingsStoreConfig: Config = {
  game: {
    path: '',
    type: EnvO.modUrl.includes('specialedition') ? GameType.se : GameType.le,
  },
  compilation: {
    concurrentScripts: 15,
    compilerPath: '',
    flag: 'TESV_Papyrus_Flags.flg',
    output: '',
  },
  mo2: {
    use: false,
  },
  groups: [],
  telemetry: {
    active: true,
  },
  theme: Theme.system,
  locale: osLocale(),
  logLevel: LogLevel.info,
  __internal__: {
    migrations: {
      version: json.version,
    },
  },
}

@inject()
class SettingsStore extends Store<Config> {
  #logger = new Logger('SettingsStore')

  resetSettings() {
    this.store = { ...defaultSettingsStoreConfig }
  }

  #checkMo2() {
    const mo2 = this.get('mo2')

    if (is.nullOrUndefined(mo2) || !is.object(mo2) || !is.boolean(mo2.use)) {
      this.reset('mo2')
    }
  }

  #checkGameType(args?: CliArgs) {
    const gameType: GameType = this.get('game.type')
    const resetGameType = (type?: GameType) =>
      this.set('game.type', type ?? defaultSettingsStoreConfig.game.type)

    const type = args?.['game-type']

    if (validateGame.gameType(type)) {
      resetGameType(type)

      return
    }

    if (!is.string(gameType)) {
      resetGameType()
    }

    switch (gameType) {
      case GameType.fo4:
      case GameType.le:
      case GameType.se:
      case GameType.vr:
        break
      default:
        resetGameType()
    }
  }

  #checkGamePath(args?: CliArgs) {
    const gamePath: string = this.get('game.path')
    const resetGamePath = (path?: GamePath) =>
      this.set('game.path', path ?? defaultSettingsStoreConfig.game.path)

    const gamePathArgs = args?.['game-path']

    if (validateGame.gamePath(gamePathArgs)) {
      resetGamePath(gamePathArgs)

      return
    }

    if (!is.string(gamePath)) {
      resetGamePath()
    }
  }

  #checkFlag() {
    const flag = this.get<string, Flag | string>('compilation.flag')

    if (!validateGame.flag(flag)) {
      this.#logger.warn(flag, 'is not supported')

      this.set('compilation.flag', toFlag(this.get('game.type')))
    }
  }

  #checkCompilerPath(args?: CliArgs) {
    const compilerPath = this.get('compilation.compilerPath')
    const gamePath: string = this.get('game.path')
    const compilerPathArgs = args?.['compiler-path']

    if (validateGame.compilerPath(compilerPathArgs)) {
      this.set('compilation.compilerPath', compilerPathArgs)

      return
    }

    if (
      is.nullOrUndefined(compilerPath) ||
      (is.string(compilerPath) &&
        is.emptyString(compilerPath.trim()) &&
        is.nonEmptyString(gamePath))
    ) {
      this.set(
        'compilation.compilerPath',
        join(gamePath, DEFAULT_COMPILER_PATH),
      )
    }
  }

  #checkOutput(args?: CliArgs) {
    const output = this.get('compilation.output')
    const outputArgs = args?.['output-path']

    if (validateGame.outputPath(outputArgs)) {
      this.set('compilation.output', outputArgs)

      return
    }

    if (!is.string(output)) {
      this.set(
        'compilation.output',
        defaultSettingsStoreConfig.compilation.output,
      )
    }
  }

  #checkGroups() {
    const groups = this.get('groups')

    if (!is.array(groups) || !groups.every(validateGroup)) {
      this.reset('groups')
    }
  }

  #checkConcurrentScripts() {
    const compilation = this.get('compilation')

    if (is.nullOrUndefined(compilation)) {
      this.reset('compilation')
    } else if (is.numericString(compilation.concurrentScripts)) {
      this.set(
        'compilation.concurrentScripts',
        parseInt(compilation.concurrentScripts, 10),
      )
    } else if (!is.number(compilation.concurrentScripts)) {
      this.set(
        'compilation.concurrentScripts',
        defaultSettingsStoreConfig.compilation.concurrentScripts,
      )
    }
  }

  #checkNotSupportedKeys() {
    const supportedKeys = [
      ...Object.keys(defaultSettingsStoreConfig),
      '__internal__',
    ]

    Object.keys(this.store).forEach((key) => {
      if (!supportedKeys.includes(key)) {
        this.delete(key as keyof Config)
      }
    })
  }

  #checkTelemetry() {
    const telemetry = this.get('telemetry')

    if (
      is.nullOrUndefined(telemetry) ||
      !is.object(telemetry) ||
      is.emptyObject(telemetry) ||
      !is.boolean(telemetry.active)
    ) {
      this.reset('telemetry')
    }
  }

  #checkTheme() {
    const theme = this.get('theme')

    if (![Theme.system, Theme.light, Theme.dark].includes(theme)) {
      this.reset('theme')
    }
  }

  #checkLocale() {
    const locale = this.get('locale')

    if (!locale.startsWith('fr') && !locale.startsWith('en')) {
      this.reset('locale')
    }
  }

  #checkLogLevel() {
    const logLevel = this.get('logLevel')

    if (!(Object.values(LogLevel) as string[]).includes(logLevel)) {
      this.reset('logLevel')
    }
  }

  check(args?: CliArgs) {
    this.#checkMo2()
    this.#checkGameType(args)
    this.#checkGamePath(args)
    this.#checkFlag()
    this.#checkCompilerPath(args)
    this.#checkOutput(args)
    this.#checkGroups()
    this.#checkConcurrentScripts()
    this.#checkNotSupportedKeys()
    this.#checkTelemetry()
    this.#checkTheme()
    this.#checkLocale()
    this.#checkLogLevel()
  }
}

function createSettingsStore() {
  const store = new SettingsStore({
    defaults: defaultSettingsStoreConfig,
    projectVersion: json.version,
    migrations: {
      '4.1.0': migrate410,
      '4.2.0': migrate420,
      '5.1.0': migrate510,
      '5.2.0': migrate520,
      '5.5.0': migrate550,
      '5.6.0': migrate560,
      '5.9.0': migrate590,
    },
  } as never)

  store.check(cliArgs)

  return store
}

export { SettingsStore, defaultSettingsStoreConfig, createSettingsStore }
