/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { app } from 'electron'
import Store from 'electron-store'
import { is } from 'electron-util'
import * as fs from 'fs'

import { join } from '../main/path/path'
import { checkStore } from './check-store'
import { GameType } from './game'
import { Config } from './interfaces/config'
import { migrate410 } from './migrations/4.1.0.migration'
import { migrate420 } from './migrations/4.2.0.migration'
import { migrate510 } from './migrations/5.1.0.migration'
import { migrate520 } from './migrations/5.2.0.migration'
import { migrate550 } from './migrations/5.5.0.migration'

const jsonPath = is.development
  ? join(__dirname, '../..', 'package.json')
  : join(app.getAppPath(), 'package.json')
const json: { version: string } = JSON.parse(
  fs.readFileSync(jsonPath).toString()
)

const defaultConfig: Config = {
  game: {
    path: '',
    type: (process.env.ELECTRON_WEBPACK_APP_MOD_URL ?? '').includes(
      'specialedition'
    )
      ? GameType.Se
      : GameType.Le
  },
  compilation: {
    concurrentScripts: 15,
    compilerPath: '',
    flag: 'TESV_Papyrus_Flags.flg',
    output: 'Data\\Scripts'
  },
  tutorials: {
    settings: true,
    telemetry: true
  },
  mo2: {
    use: false,
    output: 'overwrite\\Scripts',
    mods: 'mods'
  },
  groups: [],
  telemetry: {
    active: true
  },
  __internal__: {
    migrations: {
      version: json.version
    }
  }
}

const appStore = new Store<Config>({
  defaults: defaultConfig,
  projectVersion: json.version,
  migrations: {
    '4.1.0': migrate410,
    '4.2.0': migrate420,
    '5.1.0': migrate510,
    '5.2.0': migrate520,
    '5.4.0': migrate550
  }
} as never)

checkStore(appStore, defaultConfig)

export type AppStore = Store<Config>

export { appStore, defaultConfig }
