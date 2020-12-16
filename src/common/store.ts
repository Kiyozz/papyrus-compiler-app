/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import * as fs from 'fs'
import { app } from 'electron'
import Store from 'electron-store'
import { is } from 'electron-util'
import { join } from '../main/services/path.service'
import { Config } from './interfaces/config.interface'
import { migrate410 } from './migrations/4.1.0.migration'
import { migrate420 } from './migrations/4.2.0.migration'
import { checkStore } from './check-store'

const jsonPath = is.development
  ? join(__dirname, '../..', 'package.json')
  : join(app.getAppPath(), 'package.json')
const json = JSON.parse(fs.readFileSync(jsonPath).toString())

export const defaultConfig: Config = {
  mo2: {
    use: false,
    output: 'overwrite\\Scripts',
    mods: 'mods'
  },
  gameType: (process.env.ELECTRON_WEBPACK_APP_MOD_URL ?? '').includes(
    'specialedition'
  )
    ? 'Skyrim Special Edition'
    : 'Skyrim Legendary Edition',
  gamePath: '',
  flag: 'TESV_Papyrus_Flags.flg',
  compilerPath: '',
  output: 'Data\\Scripts',
  groups: [],
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
    '4.1.0': (store: AppStore) => {
      migrate410(store)
    },
    '4.2.0': (store: AppStore) => {
      migrate420(store)
    }
  }
} as any)

checkStore(appStore, defaultConfig)

export type AppStore = Store<Config>

export { appStore }
