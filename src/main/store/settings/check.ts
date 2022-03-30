/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { GameType, validateGame } from '../../../common/game'
import { Theme } from '../../../common/theme'
import { DEFAULT_COMPILER_PATH } from '../../constants'
// noinspection ES6PreferShortImport
import { join } from '../../path/path'
import { validateGroup } from '../../validators/group.validator'
import { Logger } from '../../logger'
import type { CliArgs } from '../../cli-args'
import type { Flag, GamePath } from '../../../common/game'
import type { Config } from '../../../common/types/config'
import type { SettingsStore } from './store'

const logger = new Logger('check')

function _checkLocale(settingsStore: SettingsStore, defaultConfig: Config) {
  const locale = settingsStore.get('locale')

  if (locale !== defaultConfig.locale) {
    settingsStore.set('locale', defaultConfig.locale)
  }
}

function _checkTheme(settingsStore: SettingsStore, defaultConfig: Config) {
  const theme = settingsStore.get('theme')

  if (![Theme.system, Theme.light, Theme.dark].includes(theme)) {
    settingsStore.set('theme', defaultConfig.theme)
  }
}

function _checkTelemetry(settingsStore: SettingsStore, defaultConfig: Config) {
  const telemetry = settingsStore.get('telemetry')

  if (
    is.nullOrUndefined(telemetry) ||
    !is.object(telemetry) ||
    is.emptyObject(telemetry) ||
    !is.boolean(telemetry.active)
  ) {
    settingsStore.set('telemetry', defaultConfig.telemetry)
  }
}

function _checkMo2(settingsStore: SettingsStore, defaultConfig: Config) {
  const mo2 = settingsStore.get('mo2')
  const resetMo2Config = () => settingsStore.set('mo2', defaultConfig.mo2)

  if (is.nullOrUndefined(mo2) || !is.object(mo2)) {
    resetMo2Config()
  }

  if (
    (Object.keys(mo2) as (keyof Config['mo2'])[]).some(key =>
      is.nullOrUndefined(mo2[key]),
    )
  ) {
    resetMo2Config()
  }

  if (!is.boolean(mo2.use)) {
    resetMo2Config()
  }

  if (!is.string(mo2.output) || is.emptyString(mo2.output.trim())) {
    resetMo2Config()
  }

  if (!is.string(mo2.mods) || is.emptyString(mo2.mods.trim())) {
    resetMo2Config()
  }

  if (
    is.null_(mo2.instance) ||
    (is.string(mo2.instance) && is.emptyString(mo2.instance.trim()))
  ) {
    resetMo2Config()
  }
}

function _checkFlag(settingsStore: SettingsStore, defaultConfig: Config) {
  const flag = settingsStore.get<string, Flag | string>('compilation.flag')

  if (
    flag !== 'TESV_Papyrus_Flags.flg' &&
    flag !== 'Institute_Papyrus_Flags.flg'
  ) {
    logger.warn(flag, 'is not supported')

    settingsStore.set(
      'compilation.flag',
      settingsStore.get('game.type') === GameType.fo4
        ? 'Institute_Papyrus_Flags.flg'
        : defaultConfig.compilation.flag,
    )
  }
}

function _checkGroups(settingsStore: SettingsStore, defaultConfig: Config) {
  const groups = settingsStore.get('groups')

  if (!is.array(groups) || !groups.every(validateGroup)) {
    settingsStore.set('groups', defaultConfig.groups)
  }
}

function _checkGameType(
  settingsStore: SettingsStore,
  defaultConfig: Config,
  args?: CliArgs,
) {
  const gameType: GameType = settingsStore.get('game.type')
  const resetGameType = (type?: GameType) =>
    settingsStore.set('game.type', type ?? defaultConfig.game.type)

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

function _checkGamePath(
  settingsStore: SettingsStore,
  defaultConfig: Config,
  args?: CliArgs,
) {
  const gamePath: string = settingsStore.get('game.path')
  const resetGamePath = (path?: GamePath) =>
    settingsStore.set('game.path', path ?? defaultConfig.game.path)

  const gamePathArgs = args?.['game-path']

  if (validateGame.gamePath(gamePathArgs)) {
    resetGamePath(gamePathArgs)

    return
  }

  if (!is.string(gamePath)) {
    resetGamePath()
  }
}

function _checkOutput(
  settingsStore: SettingsStore,
  defaultConfig: Config,
  args?: CliArgs,
) {
  const output = settingsStore.get('compilation.output')
  const outputArgs = args?.['output-path']

  if (validateGame.outputPath(outputArgs)) {
    settingsStore.set('compilation.output', outputArgs)

    return
  }

  if (!is.string(output) || is.emptyString(output.trim())) {
    settingsStore.set('compilation.output', defaultConfig.compilation.output)
  }
}

function _checkCompilerPath(settingsStore: SettingsStore, args?: CliArgs) {
  const compilerPath = settingsStore.get('compilation.compilerPath')
  const gamePath: string = settingsStore.get('game.path')
  const compilerPathArgs = args?.['compiler-path']

  if (validateGame.compilerPath(compilerPathArgs)) {
    settingsStore.set('compilation.compilerPath', compilerPathArgs)

    return
  }

  if (
    is.nullOrUndefined(compilerPath) ||
    (is.string(compilerPath) &&
      is.emptyString(compilerPath.trim()) &&
      is.nonEmptyString(gamePath))
  ) {
    settingsStore.set(
      'compilation.compilerPath',
      join(gamePath, DEFAULT_COMPILER_PATH),
    )
  }
}

function _checkNotSupportedKeys(
  settingsStore: SettingsStore,
  defaultConfig: Config,
) {
  const supportedKeys = [...Object.keys(defaultConfig), '__internal__']

  Object.keys(settingsStore.store).forEach(key => {
    if (!supportedKeys.includes(key)) {
      settingsStore.delete(key as keyof Config)
    }
  })
}

function _checkTutorials(settingsStore: SettingsStore, defaultConfig: Config) {
  const tutorials = settingsStore.get('tutorials')

  if (is.nullOrUndefined(tutorials)) {
    settingsStore.set('tutorials', defaultConfig.tutorials)
  } else {
    if (!is.boolean(tutorials.settings)) {
      settingsStore.set('tutorials.settings', defaultConfig.tutorials.settings)
    }

    if (!is.boolean(tutorials.telemetry)) {
      settingsStore.set(
        'tutorials.telemetry',
        defaultConfig.tutorials.telemetry,
      )
    }
  }
}

function _checkConcurrentScripts(
  settingsStore: SettingsStore,
  defaultConfig: Config,
) {
  const compilation = settingsStore.get('compilation')

  if (is.nullOrUndefined(compilation)) {
    settingsStore.set('compilation', defaultConfig.compilation)
  } else if (is.numericString(compilation.concurrentScripts)) {
    settingsStore.set(
      'compilation.concurrentScripts',
      parseInt(compilation.concurrentScripts, 10),
    )
  } else if (!is.number(compilation.concurrentScripts)) {
    settingsStore.set(
      'compilation.concurrentScripts',
      defaultConfig.compilation.concurrentScripts,
    )
  }
}

export function checkStore(
  settingsStore: SettingsStore,
  defaultConfig: Config,
  args?: CliArgs,
): void {
  _checkMo2(settingsStore, defaultConfig)
  _checkGameType(settingsStore, defaultConfig, args)
  _checkGamePath(settingsStore, defaultConfig, args)
  _checkFlag(settingsStore, defaultConfig)
  _checkCompilerPath(settingsStore, args)
  _checkOutput(settingsStore, defaultConfig, args)
  _checkGroups(settingsStore, defaultConfig)
  _checkTutorials(settingsStore, defaultConfig)
  _checkConcurrentScripts(settingsStore, defaultConfig)
  _checkNotSupportedKeys(settingsStore, defaultConfig)
  _checkTelemetry(settingsStore, defaultConfig)
  _checkTheme(settingsStore, defaultConfig)
  _checkLocale(settingsStore, defaultConfig)
}
