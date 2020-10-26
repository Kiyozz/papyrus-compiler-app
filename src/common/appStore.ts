import { app } from 'electron'
import Store from 'electron-store'
import { is } from 'electron-util'
import { join } from '../main/services/path'
import { Config } from './interfaces/Config'
import { Group } from './interfaces/Group'
import * as fs from 'fs'

const jsonPath = is.development ? join(__dirname, '../..', 'package.json') : join(app.getAppPath(), 'package.json')
const json = JSON.parse(fs.readFileSync(jsonPath).toString())

const defaultConfig: Config = {
  mo2: {
    use: false,
    output: 'overwrite\\Scripts',
    mods: 'mods'
  },
  gameType: (process.env.APP_NEXUS_PATH ?? '').includes('specialedition') ? 'Skyrim Special Edition' : 'Skyrim Legendary Edition',
  gamePath: '',
  flag: 'TESV_Papyrus_Flags.flg',
  compilerPath: 'Papyrus Compiler\\PapyrusCompiler.exe',
  output: 'Data\\Scripts',
  groups: [] as Group[]
}

const appStore = new Store<Config>({
  defaults: defaultConfig,
  projectVersion: json.version,
  /*schema: {
    mo2: {
      type: 'object',
      properties: {
        use: {
          description: 'MO2 is used',
          type: 'boolean',
          default: false
        },
        output: {
          description: 'Path for scripts compiled when MO2 is used',
          type: 'string'
        },
        instance: {
          description: 'Path for the MO2 Instance',
          type: 'string'
        },
        mods: {
          description: 'Path for the mods directory',
          type: 'string'
        }
      },
      required: ['use', 'output', 'mods']
    },
    gameType: {
      description: 'Type of game used',
      type: 'string',
      enum: ['Skyrim Special Edition', 'Skyrim Legendary Edition']
    },
    gamePath: {
      description: 'Path for the game',
      type: 'string'
    },
    flag: {
      description: 'Used for the Papyrus Compiler',
      type: 'string',
      enum: ['TESV_Papyrus_Flags.flg']
    },
    compilerPath: {
      description: 'Path for the Papyrus Compiler.exe relative to the {gamePath}',
      type: 'string'
    },
    output: {
      description: 'Path for scripts compiled when MO2 is not used',
      type: 'string'
    },
    groups: {
      description: 'Groups installed in the application',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          scripts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                path: {
                  type: 'string'
                }
              },
              required: ['name', 'path']
            }
          }
        },
        required: ['name', 'scripts']
      }
    }
  },*/
  migrations: {
    '4.1.0': (store: Store) => {
      store.set('mo2.mods', 'mods')
    }
  }
} as any)

const groups = appStore.get('groups')
const setOfGroupNames = new Set(groups.map(g => g.name))

if (setOfGroupNames.size !== groups.length) {
  appStore.set('groups', defaultConfig.groups)
}

export type AppStore = Store<Config>

export default appStore
