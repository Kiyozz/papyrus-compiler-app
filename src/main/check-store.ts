/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { GameType } from '../common/game'
import { Theme } from '../common/theme'
import { DEFAULT_COMPILER_PATH } from './constants'
import { join } from './path/path'
import { validateGroup } from './validators/group.validator'

import type { Config } from '../common/interfaces/config'
import type { AppStore } from './store'

function checkTheme(appStore: AppStore, defaultConfig: Config) {
  const theme = appStore.get('theme')

  if (![Theme.system, Theme.light, Theme.dark].includes(theme)) {
    appStore.set('theme', defaultConfig.theme)
  }
}

function checkTelemetry(appStore: AppStore, defaultConfig: Config) {
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

function checkMo2(appStore: AppStore, defaultConfig: Config) {
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

function checkFlag(appStore: AppStore, defaultConfig: Config) {
  const flag = appStore.get('compilation.flag')

  if (flag !== 'TESV_Papyrus_Flags.flg') {
    console.warn('only TESV_Papyrus_Flags.flg flag is supported')

    appStore.set('compilation.flag', defaultConfig.compilation.flag)
  }
}

function checkGroups(appStore: AppStore, defaultConfig: Config) {
  const groups = appStore.get('groups')

  if (!is.array(groups) || !groups.every(validateGroup)) {
    appStore.set('groups', defaultConfig.groups)
  }
}

function checkGameType(appStore: AppStore, defaultConfig: Config) {
  const gameType: GameType = appStore.get('game.type')
  const resetGameType = () => appStore.set('game.type', defaultConfig.game.type)

  if (!is.string(gameType)) {
    resetGameType()
  }

  if (
    gameType !== GameType.le &&
    gameType !== GameType.se &&
    gameType !== GameType.vr
  ) {
    resetGameType()
  }
}

function checkGamePath(appStore: AppStore, defaultConfig: Config) {
  const gamePath: string = appStore.get('game.path')
  const resetGamePath = () => appStore.set('game.path', defaultConfig.game.path)

  if (!is.string(gamePath)) {
    resetGamePath()
  }
}

function checkOutput(appStore: AppStore, defaultConfig: Config) {
  const output = appStore.get('compilation.output')

  if (!is.string(output) || is.emptyString(output.trim())) {
    appStore.set('compilation.output', defaultConfig.compilation.output)
  }
}

function checkCompilerPath(appStore: AppStore) {
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

function checkNotSupportedKeys(appStore: AppStore, defaultConfig: Config) {
  const supportedKeys = [...Object.keys(defaultConfig), '__internal__']

  Object.keys(appStore.store).forEach(key => {
    if (!supportedKeys.includes(key)) {
      appStore.delete(key as keyof Config)
    }
  })
}

function checkTutorials(appStore: AppStore, defaultConfig: Config) {
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

function checkCompilation(appStore: AppStore, defaultConfig: Config) {
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

export function checkStore(appStore: AppStore, defaultConfig: Config): void {
  checkMo2(appStore, defaultConfig)
  checkGameType(appStore, defaultConfig)
  checkGamePath(appStore, defaultConfig)
  checkFlag(appStore, defaultConfig)
  checkCompilerPath(appStore)
  checkOutput(appStore, defaultConfig)
  checkGroups(appStore, defaultConfig)
  checkTutorials(appStore, defaultConfig)
  checkCompilation(appStore, defaultConfig)
  checkNotSupportedKeys(appStore, defaultConfig)
  checkTelemetry(appStore, defaultConfig)
  checkTheme(appStore, defaultConfig)
}
