import { app } from 'electron'
import Store from 'electron-store'
import { is } from 'electron-util'
import { join } from '../main/services/path'
import { Config } from './interfaces/Config'
import * as fs from 'fs'
import { Migration410 } from './migrations/Migration410'
import { Migration420 } from './migrations/Migration420'
import { storeCheck } from './storeCheck'

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
  gameType: (process.env.APP_NEXUS_PATH ?? '').includes('specialedition')
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
      new Migration410().migrate(store)
    },
    '4.2.0': (store: AppStore) => {
      new Migration420().migrate(store)
    }
  }
} as any)

storeCheck(appStore, defaultConfig)

export type AppStore = Store<Config>

export default appStore
