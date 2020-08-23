import Store from 'electron-store'
import { Config } from './interfaces/Config'
import { Group } from './interfaces/Group'

const defaultConfig: Config = {
  mo2: {
    use: false,
    output: 'overwrite\\Scripts'
  },
  gameType: (process.env.APP_NEXUS_PATH ?? '').includes('specialedition') ? 'Skyrim Special Edition' : 'Skyrim Legendary Edition',
  gamePath: '',
  flag: 'TESV_Papyrus_Flags.flg',
  compilerPath: 'PapyrusCompiler\\PapyrusCompiler.exe',
  output: 'Data\\Scripts',
  groups: [] as Group[]
}

const appStore = new Store<Config>({
  defaults: defaultConfig,
  schema: {
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
        }
      },
      required: ['use', 'output']
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
  }
})

const groups = appStore.get('groups')
const setOfGroupNames = new Set(groups.map(g => g.name))

if (setOfGroupNames.size !== groups.length) {
  appStore.set('groups', defaultConfig.groups)
}

export type AppStore = Store<Config>

export default appStore
