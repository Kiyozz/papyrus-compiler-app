import { toAntiSlash, AppStore } from '@common'
import * as path from 'path'
import type { Migration } from './Migration'
import is from '@sindresorhus/is'

export class Migration420 implements Migration {
  migrate(store: AppStore): number {
    try {
      const gamePath = store.get('gamePath')

      if (is.nonEmptyString(gamePath)) {
        const compilerPath = store.get('compilerPath')

        store.set('compilerPath', toAntiSlash(path.join(gamePath, compilerPath)))
      }

      return 0
    } catch (err) {
      return 1
    }
  }
}
