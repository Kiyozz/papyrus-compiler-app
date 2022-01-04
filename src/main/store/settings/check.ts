/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { GameType } from '../../../common/game'
import { Theme } from '../../../common/theme'
import type { Config } from '../../../common/types/config'
import { DEFAULT_COMPILER_PATH } from '../../constants'
import { join } from '../../path/path'
import { validateGroup } from '../../validators/group.validator'
import type { SettingsStore } from './store'

function _checkLocale(appStore: SettingsStore, defaultConfig: Config) {
  const locale = appStore.get('locale')

  if (locale !== defaultConfig.locale) {
    appStore.set('locale', defaultConfig.locale)
  }
}

function _checkTheme(appStore: SettingsStore, defaultConfig: Config) {
  const theme = appStore.get('theme')

  if (![Theme.system, Theme.light, Theme.dark].includes(theme)) {
    appStore.set('theme', defaultConfig.theme)
  }
}

function _checkTelemetry(appStore: SettingsStore, defaultConfig: Config) {
  const telemetry = appStore.get('telemetry')

  if (
    is.nullOrUndefined(telemetry) ||
    !is.object(telemetry) ||
    is.emptyObject(telemetry) ||
    !is.boolean(telemetry.active)
  ) {
    appStore.set('telemetry', defaultConfig.telemetry)
  }
}

function _checkMo2(appStore: SettingsStore, defaultConfig: Config) {
  const mo2 = appStore.get('mo2')
  const resetMo2Config = () => appStore.set('mo2', defaultConfig.mo2)

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

function _checkFlag(appStore: SettingsStore, defaultConfig: Config) {
  const flag = appStore.get('compilation.flag')

  if (flag !== 'TESV_Papyrus_Flags.flg') {
    console.warn('only TESV_Papyrus_Flags.flg flag is supported')

    appStore.set('compilation.flag', defaultConfig.compilation.flag)
  }
}

function _checkGroups(appStore: SettingsStore, defaultConfig: Config) {
  const groups = appStore.get('groups')

  if (!is.array(groups) || !groups.every(validateGroup)) {
    appStore.set('groups', defaultConfig.groups)
  }
}

function _checkGameType(appStore: SettingsStore, defaultConfig: Config) {
  const gameType: GameType = appStore.get('game.type')
  const resetGameType = () => appStore.set('game.type', defaultConfig.game.type)

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

function _checkGamePath(appStore: SettingsStore, defaultConfig: Config) {
  const gamePath: string = appStore.get('game.path')
  const resetGamePath = () => appStore.set('game.path', defaultConfig.game.path)

  if (!is.string(gamePath)) {
    resetGamePath()
  }
}

function _checkOutput(appStore: SettingsStore, defaultConfig: Config) {
  const output = appStore.get('compilation.output')

  if (!is.string(output) || is.emptyString(output.trim())) {
    appStore.set('compilation.output', defaultConfig.compilation.output)
  }
}

function _checkCompilerPath(appStore: SettingsStore) {
  const compilerPath = appStore.get('compilation.compilerPath')
  const gamePath: string = appStore.get('game.path')

  if (
    is.nullOrUndefined(compilerPath) ||
    (is.string(compilerPath) &&
      is.emptyString(compilerPath.trim()) &&
      is.nonEmptyString(gamePath))
  ) {
    appStore.set(
      'compilation.compilerPath',
      join(gamePath, DEFAULT_COMPILER_PATH),
    )
  }
}

function _checkNotSupportedKeys(
  appStore: SettingsStore,
  defaultConfig: Config,
) {
  const supportedKeys = [...Object.keys(defaultConfig), '__internal__']

  Object.keys(appStore.store).forEach(key => {
    if (!supportedKeys.includes(key)) {
      appStore.delete(key as keyof Config)
    }
  })
}

function _checkTutorials(appStore: SettingsStore, defaultConfig: Config) {
  const tutorials = appStore.get('tutorials')

  if (is.nullOrUndefined(tutorials)) {
    appStore.set('tutorials', defaultConfig.tutorials)
  } else {
    if (!is.boolean(tutorials.settings)) {
      appStore.set('tutorials.settings', defaultConfig.tutorials.settings)
    }

    if (!is.boolean(tutorials.telemetry)) {
      appStore.set('tutorials.telemetry', defaultConfig.tutorials.telemetry)
    }
  }
}

function _checkCompilation(appStore: SettingsStore, defaultConfig: Config) {
  const compilation = appStore.get('compilation')

  if (is.nullOrUndefined(compilation)) {
    appStore.set('compilation', defaultConfig.compilation)
  } else if (is.numericString(compilation.concurrentScripts)) {
    appStore.set(
      'compilation.concurrentScripts',
      parseInt(compilation.concurrentScripts, 10),
    )
  } else if (!is.number(compilation.concurrentScripts)) {
    appStore.set(
      'compilation.concurrentScripts',
      defaultConfig.compilation.concurrentScripts,
    )
  }
}

export function checkStore(
  appStore: SettingsStore,
  defaultConfig: Config,
): void {
  _checkMo2(appStore, defaultConfig)
  _checkGameType(appStore, defaultConfig)
  _checkGamePath(appStore, defaultConfig)
  _checkFlag(appStore, defaultConfig)
  _checkCompilerPath(appStore)
  _checkOutput(appStore, defaultConfig)
  _checkGroups(appStore, defaultConfig)
  _checkTutorials(appStore, defaultConfig)
  _checkCompilation(appStore, defaultConfig)
  _checkNotSupportedKeys(appStore, defaultConfig)
  _checkTelemetry(appStore, defaultConfig)
  _checkTheme(appStore, defaultConfig)
  _checkLocale(appStore, defaultConfig)
}
