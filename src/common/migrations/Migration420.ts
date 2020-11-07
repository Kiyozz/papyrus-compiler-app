import { toAntiSlash, toSlash } from '../slash'
import { AppStore } from '../store'
import is from '@sindresorhus/is'
import * as util from 'electron-util'
import * as path from 'path'
import { Migration } from './Migration'

export class Migration420 implements Migration {
  migrate(store: AppStore): number {
    try {
      const gamePath = store.get('gamePath')

      if (is.nonEmptyString(gamePath)) {
        const compilerPath = store.get('compilerPath')
        const slashFunc = util.is.linux || util.is.macos ? toSlash : toAntiSlash

        store.set('compilerPath', slashFunc(path.join(gamePath, compilerPath)))
      }

      return 0
    } catch (err) {
      return 1
    }
  }
}
