/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import * as fs from 'fs'
import { app } from 'electron'
import Store from 'electron-store'
import { is } from 'electron-util'
import { osLocaleSync } from 'os-locale'
import { GameType } from '../../../common/game'
import { Theme } from '../../../common/theme'
import { cliArgs } from '../../cli-args'
import { Env } from '../../env'
// noinspection ES6PreferShortImport
import { join } from '../../path/path'
import { checkStore } from './check'
import { migrate410 } from './migrations/4.1.0.migration'
import { migrate420 } from './migrations/4.2.0.migration'
import { migrate510 } from './migrations/5.1.0.migration'
import { migrate520 } from './migrations/5.2.0.migration'
import { migrate550 } from './migrations/5.5.0.migration'
import { migrate560 } from './migrations/5.6.0.migration'
import type { Config } from '../../../common/types/config'

const jsonPath = is.development
  ? join(__dirname, '../..', 'package.json')
  : join(app.getAppPath(), 'package.json')
const json = JSON.parse(fs.readFileSync(jsonPath).toString()) as {
  version: string
}

const defaultConfig: Config = {
  game: {
    path: '',
    type: Env.modUrl.includes('specialedition') ? GameType.se : GameType.le,
  },
  compilation: {
    concurrentScripts: 15,
    compilerPath: '',
    flag: 'TESV_Papyrus_Flags.flg',
    output: join('Data/Scripts'),
  },
  tutorials: {
    settings: true,
    telemetry: true,
  },
  mo2: {
    use: false,
    output: join('overwrite/Scripts'),
    mods: 'mods',
  },
  groups: [],
  telemetry: {
    active: true,
  },
  theme: Theme.system,
  locale: osLocaleSync(),
  __internal__: {
    migrations: {
      version: json.version,
    },
  },
}

const settingsStore = new Store<Config>({
  defaults: defaultConfig,
  projectVersion: json.version,
  migrations: {
    '4.1.0': migrate410,
    '4.2.0': migrate420,
    '5.1.0': migrate510,
    '5.2.0': migrate520,
    '5.5.0': migrate550,
    '5.6.0': migrate560,
  },
} as never)

checkStore(settingsStore, defaultConfig, cliArgs)

export type SettingsStore = Store<Config>

export { settingsStore, defaultConfig }
